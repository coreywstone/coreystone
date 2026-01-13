import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import './CheggNav.css'

function CheggNav() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const andrewImageRef = useRef(null)

  useEffect(() => {
    const containerElement = containerRef.current
    if (!containerElement) return

    // Find the scrollable container (project-panel-container)
    const scrollContainer = containerElement.closest('.project-panel-container')
    if (!scrollContainer) return

    const checkVisibility = () => {
      const containerRect = containerElement.getBoundingClientRect()
      const scrollRect = scrollContainer.getBoundingClientRect()
      
      // Calculate how much of the panel is visible horizontally
      const containerLeft = containerRect.left
      const containerRight = containerRect.right
      const scrollLeft = scrollRect.left
      const scrollRight = scrollRect.right
      
      // Calculate visible width
      const visibleLeft = Math.max(containerLeft, scrollLeft)
      const visibleRight = Math.min(containerRight, scrollRight)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const containerWidth = containerRect.width
      
      // Trigger when 50% of the panel is visible
      const visibleRatio = visibleWidth / containerWidth
      if (visibleRatio >= 0.5 && !hasAnimated) {
        setIsVisible(true)
        setHasAnimated(true)
        
        // Show words 1 second later
        setTimeout(() => {
          setShowWords(true)
        }, 1000)
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
  }, [hasAnimated])

  // Set image height to 400px and panel width
  useEffect(() => {
    const img = andrewImageRef.current
    const panel = containerRef.current
    if (!img || !panel) return

    const setImageHeight = () => {
      const targetHeight = 400
      img.style.height = `${targetHeight}px`
      img.style.width = 'auto'
      
      // Set panel width based on image width (maintain aspect ratio)
      if (img.naturalWidth && img.naturalHeight > 0) {
        const aspectRatio = img.naturalWidth / img.naturalHeight
        const targetWidth = targetHeight * aspectRatio
        panel.style.width = `${targetWidth}px`
      }
    }

    // Try to set immediately if already loaded
    if (img.complete && img.naturalHeight > 0) {
      setImageHeight()
    } else {
      // Wait for image to load
      img.addEventListener('load', setImageHeight, { once: true })
      // Also check if it loads after we attach the listener
      if (img.complete) {
        setImageHeight()
      }
    }

    return () => {
      // Cleanup is handled by { once: true }
    }
  }, [])

  return (
    <div ref={containerRef} className="chegg-nav-panel">
      {/* Nav-problem panel */}
      <Backstory top={0} left={0}>
        We sell our async "flexible" courses as a B2B2C employee benefit in the Guild marketplace, with certain deadline-based completion rates. Problem is...
      </Backstory>
      <img
        ref={andrewImageRef}
        src="/img/chegg/chegg-andrew.jpg"
        alt="Andrew"
        className={`chegg-nav-andrew ${isVisible ? 'animate' : ''}`}
        onError={(e) => console.error('Failed to load chegg-andrew.jpg', e)}
      />
      <img
        src="/img/chegg/chegg-andrew-words.svg"
        alt="Andrew words"
        className={`chegg-nav-words ${showWords ? 'visible' : ''}`}
        onError={(e) => console.error('Failed to load chegg-andrew-words.svg', e)}
      />
    </div>
  )
}

export default CheggNav
