import { Object3DNode, extend } from '@react-three/fiber';
import { Line } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

// declare `line_` as a JSX element so that typescript doesn't confuse "line" for SVG
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'line_': Object3DNode<Line, typeof Line>,
        }
    }
}
