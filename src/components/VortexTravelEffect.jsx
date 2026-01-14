import { useEffect, useRef } from 'react'
import './VortexTravelEffect.css'

function VortexTravelEffect({ isActive, onComplete }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isActive) return

    const duration = 6000 // 6000ms (6 seconds - slowed down 2x)
    const fadeOutDuration = 500 // 500ms fade out
    
    // Start fade out after duration
    const fadeOutTimeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add('fading')
      }
    }, duration)

    // Complete after fade out
    const completeTimeout = setTimeout(() => {
      if (onComplete) {
        onComplete()
      }
    }, duration + fadeOutDuration)

    return () => {
      clearTimeout(fadeOutTimeout)
      clearTimeout(completeTimeout)
    }
  }, [isActive, onComplete])

  if (!isActive) return null

  return (
    <div ref={containerRef} className="vortex-travel-effect">
      <div className="vortex-spiral vortex-spiral-1"></div>
      <div className="vortex-spiral vortex-spiral-2"></div>
      <div className="vortex-spiral vortex-spiral-3"></div>
    </div>
  )
}

export default VortexTravelEffect
