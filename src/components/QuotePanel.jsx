import { useState, useEffect, useRef } from 'react'
import InlineSVG from './InlineSVG'
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
  alignment = 'left' // 'left' or 'right'
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [canStartWords, setCanStartWords] = useState(false)
  const [currentBubble, setCurrentBubble] = useState(-1)
  const [hasStarted, setHasStarted] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(1)
  const [availableWords, setAvailableWords] = useState({
    words1: !!words1Src,
    words2: !!words2Src,
    words3: !!words3Src
  })
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

  // Check which word images actually exist by trying to load them
  useEffect(() => {
    const checkImageExists = (src, key) => {
      if (!src) {
        setAvailableWords(prev => ({ ...prev, [key]: false }))
        return
      }
      
      const img = new Image()
      img.onload = () => {
        setAvailableWords(prev => ({ ...prev, [key]: true }))
      }
      img.onerror = () => {
        setAvailableWords(prev => ({ ...prev, [key]: false }))
      }
      img.src = src
    }

    checkImageExists(words1Src, 'words1')
    checkImageExists(words2Src, 'words2')
    checkImageExists(words3Src, 'words3')
  }, [words1Src, words2Src, words3Src])

  // Start animation sequence when canStartWords becomes true (only once)
  useEffect(() => {
    const total = Object.values(availableWords).filter(Boolean).length
    if (canStartWords && !hasStarted && total > 0) {
      setHasStarted(true)
      startBubbleSequence(0)
    }
  }, [canStartWords, hasStarted, availableWords])

  const startBubbleSequence = (bubbleIndex) => {
    // Only count bubbles that actually exist
    const bubbleCount = [availableWords.words1, availableWords.words2, availableWords.words3].filter(Boolean).length

    if (bubbleIndex >= bubbleCount) {
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
    bottom: 0,
    [alignment === 'left' ? 'left' : 'right']: 0,
  }

  const wordsStyle = {
    position: 'absolute',
    bottom: 0,
    [alignment === 'left' ? 'left' : 'right']: 0,
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
          <InlineSVG src={titleSrc} alt={name || 'Quote'} />
        </div>
      )}

      {/* Character */}
      {picSrc && (
        <div className="quote-panel-character" style={characterStyle}>
          <img src={picSrc} alt={name || 'Character'} />
        </div>
      )}

      {/* Speech Bubbles (words SVGs) */}
      {(availableWords.words1 || availableWords.words2 || availableWords.words3) && (
        <div className={`quote-panel-words quote-panel-words-${alignment}`} style={wordsStyle}>
          {availableWords.words1 && words1Src && (
            <InlineSVG
              src={words1Src}
              alt="Quote bubble 1"
              className={`quote-panel-words-img first ${currentBubble >= 0 ? 'visible' : ''}`}
            />
          )}
          {availableWords.words2 && words2Src && (
            <InlineSVG
              src={words2Src}
              alt="Quote bubble 2"
              className={`quote-panel-words-img overlay ${currentBubble >= 1 ? 'visible' : ''}`}
            />
          )}
          {availableWords.words3 && words3Src && (
            <InlineSVG
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

