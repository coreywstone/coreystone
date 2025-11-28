import { useState, useEffect, useRef } from 'react'
import './QuotePanel.css'

function QuotePanel({ 
  name,
  bgSrc,
  picSrc,
  titleSrc,
  words1Src,
  words2Src,
  words3Src,
  canStart = false,
  onComplete,
  characterPosition = 'bottom-left',
  characterOffsetX = 0,
  characterOffsetY = 0,
  bubblePosition = 'right'
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [canStartWords, setCanStartWords] = useState(false)
  const [currentBubble, setCurrentBubble] = useState(-1)
  const [hasStarted, setHasStarted] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(1)
  const panelRef = useRef(null)
  const bgRef = useRef(null)
  const bubbleTimeoutRef = useRef(null)
  const wordsDelayTimeoutRef = useRef(null)

  // Intersection Observer for scroll-triggered animations (vertical only)
  useEffect(() => {
    const checkVerticalVisibility = () => {
      if (!panelRef.current) return
      
      const rect = panelRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate vertical visibility only (ignore horizontal position)
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
      const verticalVisibilityRatio = Math.max(0, visibleHeight) / rect.height
      
      // Trigger when panel is at least 90% visible vertically
      if (verticalVisibilityRatio >= 0.9 && !isVisible) {
        setIsVisible(true)
        // Start words animation 500ms after character appears
        wordsDelayTimeoutRef.current = setTimeout(() => {
          setCanStartWords(true)
        }, 500)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          checkVerticalVisibility()
        })
      },
      { 
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    )

    if (panelRef.current) {
      observer.observe(panelRef.current)
      // Also check on scroll for reliability
      window.addEventListener('scroll', checkVerticalVisibility, { passive: true })
      checkVerticalVisibility() // Initial check
    }

    return () => {
      if (panelRef.current) {
        observer.unobserve(panelRef.current)
      }
      window.removeEventListener('scroll', checkVerticalVisibility)
    }
  }, [isVisible])

  // Parallax effect on page scroll - using zoom/scale
  useEffect(() => {
    const handleScroll = () => {
      if (!panelRef.current || !bgRef.current) return
      
      const rect = panelRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY || window.pageYOffset
      const panelTop = rect.top + scrollY
      const panelHeight = rect.height
      const panelCenter = panelTop + panelHeight / 2
      const viewportCenter = scrollY + windowHeight / 2
      
      // Cinematic zoom parallax: scale from 1.0 (100%) to 1.2 (120%) based on scroll position
      // Never go below 100% to prevent gaps
      const scrollProgress = (viewportCenter - panelCenter) / windowHeight
      // Clamp between 0 and 1 for smooth effect (0 = no zoom, 1 = max zoom)
      const clampedProgress = Math.max(0, Math.min(1, (scrollProgress + 0.5)))
      // Scale from 1.0 (100%) to 1.2 (120%) - never below 100%
      const scale = 1.0 + (clampedProgress * 0.2)
      setParallaxOffset(scale)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Start animation sequence when canStartWords becomes true (only once)
  useEffect(() => {
    const total = [words1Src, words2Src, words3Src].filter(Boolean).length
    if (canStartWords && !hasStarted && total > 0) {
      setHasStarted(true)
      startBubbleSequence(0)
    }
  }, [canStartWords, hasStarted, words1Src, words2Src, words3Src])

  const startBubbleSequence = (bubbleIndex) => {
    const sources = [words1Src, words2Src, words3Src].filter(Boolean)
    const totalBubbles = sources.length

    if (bubbleIndex >= totalBubbles) {
      if (onComplete) {
        onComplete()
      }
      return
    }

    // Reset state for new bubble index
    setCurrentBubble(bubbleIndex)
    // Schedule the next bubble after 500ms
    bubbleTimeoutRef.current = setTimeout(() => {
      startBubbleSequence(bubbleIndex + 1)
    }, 500)
  }


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current)
      }
      if (wordsDelayTimeoutRef.current) {
        clearTimeout(wordsDelayTimeoutRef.current)
      }
    }
  }, [])

  const characterStyle = {
    position: 'absolute',
    bottom: `${characterOffsetY}%`,
    [characterPosition === 'bottom-left' ? 'left' : 'right']: `${characterOffsetX}%`,
  }

  const bubbleStyle = {
    position: 'absolute',
    bottom: 0,
    [bubblePosition === 'right' ? 'right' : 'left']: 0,
  }


  return (
    <div 
      ref={panelRef}
      className={`quote-panel ${isVisible ? 'visible' : ''}`}
    >
      {/* Background */}
      {bgSrc && (
        <div className="quote-panel-bg" ref={bgRef}>
          <img 
            src={bgSrc} 
            alt="" 
            style={{ transform: `scale(${parallaxOffset})` }}
          />
        </div>
      )}

      {/* Title */}
      {titleSrc && (
        <div className="quote-panel-title">
          <img src={titleSrc} alt={name || 'Quote'} />
        </div>
      )}

      {/* Character */}
      {picSrc && (
        <div className="quote-panel-character" style={characterStyle}>
          <img src={picSrc} alt={name || 'Character'} />
        </div>
      )}

      {/* Speech Bubbles (words SVGs) */}
      {(words1Src || words2Src || words3Src) && (
        <div className="quote-panel-words" style={bubbleStyle}>
          {words1Src && (
            <img
              src={words1Src}
              alt="Quote bubble 1"
              className={`quote-panel-words-img first ${currentBubble >= 0 ? 'visible' : ''}`}
            />
          )}
          {words2Src && (
            <img
              src={words2Src}
              alt="Quote bubble 2"
              className={`quote-panel-words-img overlay ${currentBubble >= 1 ? 'visible' : ''}`}
            />
          )}
          {words3Src && (
            <img
              src={words3Src}
              alt="Quote bubble 3"
              className={`quote-panel-words-img overlay ${currentBubble >= 2 ? 'visible' : ''}`}
            />
          )}
        </div>
      )}

    </div>
  )
}

export default QuotePanel

