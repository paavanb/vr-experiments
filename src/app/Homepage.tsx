import * as React from 'react'
import {VRCanvas, Hands, DefaultXRControllers} from '@react-three/xr'

export default function Homepage(): JSX.Element {
  return (
    <VRCanvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <DefaultXRControllers />
      <Hands />
    </VRCanvas>
  )
}
