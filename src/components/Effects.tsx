import React, {Suspense} from 'react'
import * as THREE from 'three'
import {EffectComposer, Bloom, SSAO} from '@react-three/postprocessing'
import {useThree} from '@react-three/fiber'

export default function Effects(): JSX.Element {
  const {camera, scene} = useThree()
  return (
    <Suspense fallback={null}>
      <EffectComposer enabled camera={camera} scene={scene}>
        <SSAO />
        <Bloom />
      </EffectComposer>
    </Suspense>
  )
}
