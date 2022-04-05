import * as React from 'react'
import * as THREE from 'three'
import {useRef, useState} from 'react'
import {VRCanvas, DefaultXRControllers} from '@react-three/xr'
import {useFrame} from '@react-three/fiber'

import ControllerRelativeMovement from '../player/locomotion/ControllerRelativeMovement'
import HybridControllerCameraRelativeMovement from '../player/locomotion/HybridControllerCameraRelativeMovement'
import GrabAndPullMovement from '../player/locomotion/GrabAndPullMovement'
import Effects from '../components/Effects'

const ROTATION_SPEED = (delta: number): number => delta * 0

function RotatingBox(props: JSX.IntrinsicElements['mesh']): JSX.Element {
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

export default function Homepage(): JSX.Element {
  return (
    <VRCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <RotatingBox position={[-1.2, 0, 0]} />
      <RotatingBox position={[1.2, 0, 0]} />

      <GrabAndPullMovement />
      <DefaultXRControllers />
      {/* EffectComposer breaks VR mode */}
      {/* <Effects /> */}
    </VRCanvas>
  )
}
