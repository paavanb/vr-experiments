import {useRef} from 'react'

/**
 * Hook that can be used to calculate the current time-delta
 * since the last time logged.
 *
 * Example
 * ```
 * getDelta = useTimeDelta()
 *
 * useXRFrame((time, state) => {
 *   const myCalculation = 10 * getDelta(time)
 * })
 * ```
 */
export default function useTimeDelta(): (time: number) => number {
  const prevTimeRef = useRef<number | null>(null)

  const getDelta = (time: number): number => {
    let delta = 0
    if (prevTimeRef.current != null)
      delta = time - prevTimeRef.current

    prevTimeRef.current = time
    return delta / 1000
  }

  return getDelta
}
