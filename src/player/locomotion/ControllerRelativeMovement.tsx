import * as React from 'react'
import * as THREE from 'three'
import {useController, useXR} from '@react-three/xr'
import {useFrame} from '@react-three/fiber'

import {ThumbstickAxis, WellKnownVec} from '../constants'

import {PLAYER_SPEED} from './constants'

/**
 * Use controller-relative movement for locomotion.
 * The left analog stick y-axis controls movement parallel to the controller.
 * The right analog stick x-axis controls movement perpendicular to the controller.
 */
export default function ControllerRelativeMovement(): JSX.Element {
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
        rightGamepad.axes[ThumbstickAxis.X],
        0,
        leftGamepad.axes[ThumbstickAxis.Y]
      )

      // We can easily grab the y-axis rotation from the Euler representation of the controller's rotation
      const controllerEuler = new THREE.Euler(0, 0, 0, 'YXZ').setFromQuaternion(
        leftController.controller.quaternion
      )
      const controllerAngle = controllerEuler.y
      const movementVec = thumbstickVec.applyAxisAngle(WellKnownVec.UP, controllerAngle)

      player.position.x += PLAYER_SPEED(delta) * movementVec.x
      player.position.z += PLAYER_SPEED(delta) * movementVec.z
    }
  })

  return <></>
}
