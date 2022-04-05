import * as React from 'react'
import * as THREE from 'three'
import {useController, useXR} from '@react-three/xr'
import {useFrame, useThree} from '@react-three/fiber'

import {ThumbstickAxis, WellKnownVec} from '../constants'

import {PLAYER_SPEED} from './constants'

/**
 * Use a hybrid approach for locomotion.
 * The left analog stick y-axis controls movement parallel to the controller.
 * The right analog stick x-axis controls movement perpendicular to the camera.
 */
export default function HybridControllerCameraRelativeMovement(): JSX.Element {
  const {player} = useXR()
  const {camera} = useThree<{camera: THREE.PerspectiveCamera}>()
  const leftController = useController('left')
  const rightController = useController('right')

  // Player Movement
  useFrame((_, delta) => {
    const leftGamepad = leftController?.inputSource?.gamepad
    const rightGamepad = rightController?.inputSource?.gamepad

    if (leftGamepad && leftController && rightGamepad && rightController) {
      const playerForwardVec = new THREE.Vector3(0, 0, leftGamepad.axes[ThumbstickAxis.Y])
      const playerStrafeVec = new THREE.Vector3(rightGamepad.axes[ThumbstickAxis.X], 0, 0)

      // We can easily grab the y-axis rotation from the Euler representation of the controller's rotation
      const controllerEuler = new THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(
        leftController.controller.quaternion
      )
      const cameraEuler = new THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(camera.quaternion)
      const controllerAngle = controllerEuler.y
      const cameraAngle = cameraEuler.y

      const parallelMovementVec = playerForwardVec.applyAxisAngle(WellKnownVec.UP, controllerAngle)
      const perpMovementVec = playerStrafeVec.applyAxisAngle(WellKnownVec.UP, cameraAngle)

      const movementVec = parallelMovementVec
        .clone()
        .add(perpMovementVec)
        .multiplyScalar(PLAYER_SPEED(delta))

      player.position.x += movementVec.x
      player.position.z += movementVec.z
    }
  })

  return <></>
}
