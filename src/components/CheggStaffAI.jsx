import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import './CheggStaffAI.css'

function CheggStaffAI() {
  const wireRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const [showAsk, setShowAsk] = useState(false)
  const [showHmm, setShowHmm] = useState(false)

  useEffect(() => {
    const wireElement = wireRef.current
    if (!wireElement) return

    // Find the scrollable container (project-panel-container)
    const scrollContainer = wireElement.closest('.project-panel-container')
    if (!scrollContainer) return

    const checkVisibility = () => {
      const wireRect = wireElement.getBoundingClientRect()
      const containerRect = scrollContainer.getBoundingClientRect()
      
      // Calculate how much of the Wire panel is visible horizontally
      const wireLeft = wireRect.left
      const wireRight = wireRect.right
      const containerLeft = containerRect.left
      const containerRight = containerRect.right
      
      // Calculate visible width of Wire panel
      const visibleLeft = Math.max(wireLeft, containerLeft)
      const visibleRight = Math.min(wireRight, containerRight)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const wireWidth = wireRect.width
      
      // Trigger when 1/3 (33%) of the Wire panel is visible
      const visibleRatio = visibleWidth / wireWidth
      if (visibleRatio >= 0.33 && !isVisible) {
        console.log('Wire panel 1/3 visible, triggering animation', { visibleRatio, visibleWidth, wireWidth })
        setIsVisible(true)
      }
    }

    // Check initially
    checkVisibility()

    // Listen to scroll events on the container
    scrollContainer.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [isVisible])

  // Show words after bounce completes (1000ms descent + 600ms bounce = 1600ms)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowWords(true)
      }, 1600)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Show ask image after 3 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowAsk(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Show hmm image at 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowHmm(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <div className="chegg-staff-ai-panel">
      <div ref={wireRef} className="chegg-staff-ai-wire">
        {/* Wire panel content will go here */}
        <img
          src="/img/me/me-on-wire.svg"
          alt="Corey on wire"
          className={`chegg-staff-ai-me-on-wire ${isVisible ? 'animate' : ''}`}
        />
        <img
          src="/img/chegg/chegg-wire-words.svg"
          alt=""
          className={`chegg-staff-ai-wire-words ${showWords ? 'visible' : ''}`}
        />
        <img
          src="/img/chegg/chegg-wire-ask.svg"
          alt=""
          className={`chegg-staff-ai-wire-ask ${showAsk ? 'visible' : ''}`}
        />
        <img
          src="/img/chegg/chegg-hmm-get-up-to-speed.svg"
          alt=""
          className={`chegg-staff-ai-hmm ${showHmm ? 'visible' : ''}`}
        />
      </div>
      <div className="chegg-staff-ai-personas">
        <Backstory>
          To learn about our business processes and problems, I interviewed our student success coaches, tutors, mentors, and Admission reps.
        </Backstory>
      </div>
    </div>
  )
}

export default CheggStaffAI

