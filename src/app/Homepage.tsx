import * as React from 'react'
import * as THREE from 'three'
import {useRef, useState} from 'react'
import {VRCanvas, DefaultXRControllers, useController, useXR, useXRFrame} from '@react-three/xr'
import {useFrame} from '@react-three/fiber'

const PLAYER_SPEED = (delta: number): number => delta * 0.3
const ROTATION_SPEED = (delta: number): number => delta * 0

const THUMBSTICK_AXIS_X = 2
const THUMBSTICK_AXIS_Y = 3

const UP_VEC = new THREE.Vector3(0, 1, 0)

function RotatingBox(props: JSX.IntrinsicElements.mesh): JSX.Element {
  const ref = useRef<THREE.Mesh | null>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.x += ROTATION_SPEED(delta)
  })

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked((prevClicked) => !prevClicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Player(): JSX.Element {
  const {player} = useXR()
  const leftController = useController('left')
  const rightController = useController('right')

  // Player Movement
  useFrame((_, delta) => {
    const leftGamepad = leftController?.inputSource?.gamepad
    const rightGamepad = rightController?.inputSource?.gamepad

    if (leftGamepad && rightGamepad && leftController && rightController) {
      // Left thumbstick controls parallel movement, right controls perpendicular
      const thumbstickVec = new THREE.Vector3(
        rightGamepad.axes[THUMBSTICK_AXIS_X],
        0,
        leftGamepad.axes[THUMBSTICK_AXIS_Y]
      )

      // We can easily grab the y-axis rotation from the Euler representation of the controller's rotation
      const controllerEuler = new THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(
        leftController.controller.quaternion
      )
      const controllerAngle = controllerEuler.y
      const movementVec = thumbstickVec.applyAxisAngle(UP_VEC, controllerAngle)

      player.position.x += PLAYER_SPEED(delta) * movementVec.x
      player.position.z += PLAYER_SPEED(delta) * movementVec.z
    }
  })

  return <></>
}

export default function Homepage(): JSX.Element {
  return (
    <VRCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <RotatingBox position={[-1.2, 0, 0]} />
      <RotatingBox position={[1.2, 0, 0]} />

      <Player />
      <DefaultXRControllers />
    </VRCanvas>
  )
}
