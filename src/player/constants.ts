import * as THREE from 'three'

// Map from thumbstick axis to corresponding index in THREE.XRGamepad.axes array
export const ThumbstickAxis = {
  X: 2,
  Y: 3,
}

export const WellKnownVec = {
  UP: new THREE.Vector3(0, 1, 0),
}
