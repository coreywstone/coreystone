import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import './CheggNav.css'

function CheggNav() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const andrewImageRef = useRef(null)
  const ambiguousImageRef = useRef(null)

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

  // Set image heights and calculate panel width to fit all content
  useEffect(() => {
    const andrewImg = andrewImageRef.current
    const ambiguousImg = ambiguousImageRef.current
    const panel = containerRef.current
    if (!andrewImg || !panel) return

    const calculatePanelWidth = () => {
      // Set Andrew image height to 400px
      const targetHeight = 400
      andrewImg.style.height = `${targetHeight}px`
      andrewImg.style.width = 'auto'
      
      // Wait a bit for images to render, then calculate
      setTimeout(() => {
        requestAnimationFrame(() => {
          let requiredWidth = 450 // minimum for ambiguous image position at left: 450px
          
          // Calculate width needed for ambiguous image (450px left + image width + 12px border)
          if (ambiguousImg) {
            // Try multiple methods to get the image width
            const ambiguousRect = ambiguousImg.getBoundingClientRect()
            let ambiguousWidth = 0
            
            if (ambiguousRect.width > 0) {
              ambiguousWidth = ambiguousRect.width
            } else if (ambiguousImg.offsetWidth > 0) {
              ambiguousWidth = ambiguousImg.offsetWidth
            } else if (ambiguousImg.naturalWidth && ambiguousImg.naturalWidth > 0) {
              // For SVG, naturalWidth might be the viewBox width
              ambiguousWidth = ambiguousImg.naturalWidth
            } else {
              // Fallback: try to get dimensions from the SVG element itself
              const svgElement = ambiguousImg.querySelector ? ambiguousImg.querySelector('svg') : null
              if (svgElement) {
                const svgRect = svgElement.getBoundingClientRect()
                if (svgRect.width > 0) {
                  ambiguousWidth = svgRect.width
                } else if (svgElement.viewBox && svgElement.viewBox.baseVal) {
                  ambiguousWidth = svgElement.viewBox.baseVal.width
                }
              }
            }
            
            if (ambiguousWidth > 0) {
              requiredWidth = 450 + ambiguousWidth + 12
            } else {
              // Last resort: estimate based on a reasonable size (SVGs are often around 200-400px wide)
              requiredWidth = 450 + 300 + 12 // 300px estimate + 12px border
            }
          }
          
          // Also check if Andrew image or words extend beyond
          const andrewRect = andrewImg.getBoundingClientRect()
          if (andrewRect.width > 0) {
            requiredWidth = Math.max(requiredWidth, andrewRect.width + 12)
          } else if (andrewImg.naturalWidth && andrewImg.naturalHeight > 0) {
            const andrewAspectRatio = andrewImg.naturalWidth / andrewImg.naturalHeight
            const estimatedAndrewWidth = targetHeight * andrewAspectRatio
            requiredWidth = Math.max(requiredWidth, estimatedAndrewWidth + 12)
          }
          
          // Ensure minimum width (at least enough for ambiguous image at 500px + estimated width)
          requiredWidth = Math.max(requiredWidth, 1000)
          
          // Force the width with !important via setProperty
          panel.style.setProperty('width', `${requiredWidth}px`, 'important')
          panel.style.setProperty('min-width', `${requiredWidth}px`, 'important')
          
          console.log('Nav panel width calculated:', requiredWidth, 'ambiguous width:', ambiguousImg ? (ambiguousImg.getBoundingClientRect().width || ambiguousImg.offsetWidth || 'unknown') : 'no img', 'ambiguous left:', ambiguousImg ? ambiguousImg.getBoundingClientRect().left : 'no img')
        })
      }, 100) // Small delay to ensure images are rendered
    }

    // Set up load listeners for both images
    const handleAndrewLoad = () => {
      calculatePanelWidth()
    }
    
    const handleAmbiguousLoad = () => {
      calculatePanelWidth()
    }

    // Try to calculate immediately if images are loaded
    if (andrewImg.complete && andrewImg.naturalHeight > 0) {
      handleAndrewLoad()
    } else {
      andrewImg.addEventListener('load', handleAndrewLoad, { once: true })
    }

    if (ambiguousImg) {
      if (ambiguousImg.complete) {
        handleAmbiguousLoad()
      } else {
        ambiguousImg.addEventListener('load', handleAmbiguousLoad, { once: true })
      }
    }

    // Also recalculate on window resize
    const handleResize = () => {
      calculatePanelWidth()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      andrewImg.removeEventListener('load', handleAndrewLoad)
      if (ambiguousImg) {
        ambiguousImg.removeEventListener('load', handleAmbiguousLoad)
      }
      window.removeEventListener('resize', handleResize)
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
        className="chegg-nav-andrew"
        onError={(e) => console.error('Failed to load chegg-andrew.jpg', e)}
      />
      <img
        src="/img/chegg/chegg-andrew-words.svg"
        alt="Andrew words"
        className={`chegg-nav-words ${showWords ? 'visible' : ''}`}
        onError={(e) => console.error('Failed to load chegg-andrew-words.svg', e)}
      />
      <img
        ref={ambiguousImageRef}
        src="/img/me/me-ambiguous-problem.svg"
        alt="Ambiguous problem"
        className={`chegg-nav-ambiguous ${isVisible ? 'animate' : ''}`}
        onError={(e) => console.error('Failed to load me-ambiguous-problem.svg', e)}
      />
    </div>
  )
}

export default CheggNav
