import * as React from 'react'
import * as THREE from 'three'
import {useState} from 'react'
import {XRController, useXR, useXREvent} from '@react-three/xr'
import {useFrame} from '@react-three/fiber'
import {useSpring, config} from '@react-spring/three'

interface ControllerAnchor {
  position: THREE.Vector3 // World position of controller at time of anchor
  controller: XRController // Reference to controller performing the anchor
}

interface PlayerAnchorState {
  player: {
    quaternion: THREE.Quaternion
  }
  anchors: ControllerAnchor[]
}

interface AnchorVizProps {
  position: THREE.Vector3
}

function AnchorViz(props: AnchorVizProps): JSX.Element {
  const {position} = props
  const linePoints = [
    new THREE.Vector3(position.x, -10, position.z),
    new THREE.Vector3(position.x, 10, position.z),
  ]

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)
  return (
    <line_ geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#fff" linewidth={5} />
    </line_>
  )
}

/**
 * Allow the player to move around by "pulling" themselves through the world,
 * as if by grabbing the ether.
 */
export default function GrabAndPullMovement(): JSX.Element {
  const {player} = useXR()
  const [{vx, vz}, velocitySpringApi] = useSpring(() => ({
    to: {
      vx: 0,
      vz: 0,
    },
    config: {
      ...config.default,
      clamp: true,
    },
  }))

  const [anchorState, setAnchorState] = useState<PlayerAnchorState>({
    player: {quaternion: player.quaternion.clone()},
    anchors: [],
  })

  // Add to squeezed controllers
  useXREvent('squeezestart', (event) => {
    setAnchorState((prevAnchorState) => {
      if (prevAnchorState.anchors.find((a) => a.controller === event.controller))
        return prevAnchorState

      const controllerWorldPosition = new THREE.Vector3()
      event.controller.controller.getWorldPosition(controllerWorldPosition)

      return {
        ...prevAnchorState,
        player: {quaternion: player.quaternion.clone()},  // Cache the player's quaternion
        anchors: [
          ...prevAnchorState.anchors,
          {position: controllerWorldPosition, controller: event.controller},
        ],
      }
    })
  })

  // Remove from squeezed controllers
  useXREvent('squeezeend', (event) => {
    setAnchorState((prevAnchorState) => ({
      ...prevAnchorState,
      player: {quaternion: player.quaternion.clone()},  // Cache the player's quaternion
      anchors: prevAnchorState.anchors
        .filter((a) => a.controller !== event.controller)
        .map(a => {
          // Reset any existing anchor's position, to avoid a discontinuity if both controllers were anchored
          const controllerWorldPosition = new THREE.Vector3()
          a.controller.controller.getWorldPosition(controllerWorldPosition)
          return {
            ...a,
            position: controllerWorldPosition,
          }
        }),
    }))
  })

  // Adjust the player's position such that the anchoring controller is fixed in space
  useFrame((_, delta) => {
    if (anchorState.anchors.length !== 1) return
    const anchor = anchorState.anchors[0]

    const controllerWorldPosition = new THREE.Vector3()
    anchor.controller.controller.getWorldPosition(controllerWorldPosition)

    const offset = anchor.position
      .clone()
      .setY(0)
      .sub(new THREE.Vector3(controllerWorldPosition.x, 0, controllerWorldPosition.z))

    velocitySpringApi.set({vx: offset.x / delta, vz: offset.z / delta})
    player.position.copy(player.position.clone().add(offset))
  })

  // Add momentum to player after finished anchoring
  useFrame((_, delta) => {
    if (anchorState.anchors.length !== 0) return

    velocitySpringApi.start({vx: 0, vz: 0})

    if (vx.get() || vz.get())
      player.position.add(new THREE.Vector3(vx.get() * delta, 0, vz.get() * delta))
  })

  if (anchorState.anchors.length === 1)
    return <AnchorViz position={anchorState.anchors[0].position} />
  return <></>
}
