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
  const [titleColor, setTitleColor] = useState('#8DD6F0') // Default color
  const [showParticles, setShowParticles] = useState(false)
  const [showCharacter, setShowCharacter] = useState(false)
  const [hasPlayedEffect, setHasPlayedEffect] = useState(false) // Track if effect has played
  const [availableWords, setAvailableWords] = useState({
    words1: !!words1Src,
    words2: !!words2Src,
    words3: !!words3Src
  })
  const panelRef = useRef(null)
  const bgRef = useRef(null)
  const bubbleTimeoutRef = useRef(null)
  const wordsDelayTimeoutRef = useRef(null)
  const teleporterTimeoutRef = useRef(null)
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const particlesRef = useRef([])

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

  // Extract color from title SVG and increase saturation
  useEffect(() => {
    if (!titleSrc) return
    
    fetch(titleSrc)
      .then(response => response.text())
      .then(svgText => {
        // Find the first path with a fill color (the title box background)
        // Look for fill attributes that aren't black/dark colors
        const fillMatches = svgText.matchAll(/fill="([^"]+)"/g)
        for (const match of fillMatches) {
          const color = match[1]
          // Skip black, dark gray, and transparent colors
          if (color && 
              !color.startsWith('#262629') && 
              !color.startsWith('#000') && 
              color !== 'none' && 
              color !== 'transparent' &&
              color.startsWith('#')) {
            // Increase saturation of the color
            const saturatedColor = increaseSaturation(color)
            setTitleColor(saturatedColor)
            break
          }
        }
      })
      .catch(() => {
        // Fallback to default if fetch fails
      })
  }, [titleSrc])

  // Helper function to increase color saturation
  const increaseSaturation = (hex) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    
    // Convert to HSL
    const rNorm = r / 255
    const gNorm = g / 255
    const bNorm = b / 255
    
    const max = Math.max(rNorm, gNorm, bNorm)
    const min = Math.min(rNorm, gNorm, bNorm)
    let h, s, l = (max + min) / 2
    
    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
      }
    }
    
    // Increase saturation (multiply by 1.5, cap at 1.0)
    s = Math.min(1.0, s * 1.5)
    
    // Convert back to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h * 6) % 2 - 1))
    const m = l - c / 2
    
    let rNew, gNew, bNew
    if (h < 1/6) {
      rNew = c; gNew = x; bNew = 0
    } else if (h < 2/6) {
      rNew = x; gNew = c; bNew = 0
    } else if (h < 3/6) {
      rNew = 0; gNew = c; bNew = x
    } else if (h < 4/6) {
      rNew = 0; gNew = x; bNew = c
    } else if (h < 5/6) {
      rNew = x; gNew = 0; bNew = c
    } else {
      rNew = c; gNew = 0; bNew = x
    }
    
    rNew = Math.round((rNew + m) * 255)
    gNew = Math.round((gNew + m) * 255)
    bNew = Math.round((bNew + m) * 255)
    
    return `#${rNew.toString(16).padStart(2, '0')}${gNew.toString(16).padStart(2, '0')}${bNew.toString(16).padStart(2, '0')}`
  }

  // Particle system for teleporter effect
  useEffect(() => {
    if (!showParticles || !canvasRef.current || !panelRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const panel = panelRef.current
    
    const updateCanvasSize = () => {
      const rect = panel.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    
    updateCanvasSize()
    
    // Handle resize
    const handleResize = () => {
      updateCanvasSize()
    }
    window.addEventListener('resize', handleResize)
    
    // Bright yellow color #FFFC54
    const r = 255
    const g = 252
    const b = 84
    
    // Effect width and positioning
    const effectWidth = 300
    const edgeOffset = 24
    // Calculate centerX so column is exactly 24px from the side edge
    // For left: column starts at 24px, so center is at 24 + 300/2 = 174px
    // For right: column ends at canvas.width - 24px, so center is at (canvas.width - 24) - 300/2
    const centerX = alignment === 'left' 
      ? edgeOffset + effectWidth / 2 // Left side: 24px from left edge, center at 174px
      : canvas.width - edgeOffset - effectWidth / 2 // Right side: 24px from right edge
    
    // Particle class
    class Particle {
      constructor(startTime, edgeBias = false) {
        this.startTime = startTime
        this.edgeBias = edgeBias
        this.initialize()
      }
      
      initialize() {
        // Position particles - more in the middle for 3D column effect
        // Particles should span the full effectWidth (300px), with more density in center
        let xOffset
        if (this.edgeBias) {
          // For center-biased particles: concentrated in middle 40% of column width
          const centerZone = effectWidth * 0.4 // 120px for 300px width
          xOffset = (Math.random() - 0.5) * centerZone // Concentrated in center
        } else {
          // Full-width distribution but weighted toward center
          const random = Math.random()
          // Bias toward center using a distribution that favors middle
          if (random < 0.7) {
            // 70% of particles in center 60% of width
            xOffset = (Math.random() - 0.5) * effectWidth * 0.6
          } else {
            // 30% of particles in outer zones
            const isLeftEdge = Math.random() < 0.5
            if (isLeftEdge) {
              xOffset = -effectWidth / 2 + Math.random() * effectWidth * 0.2
            } else {
              xOffset = effectWidth / 2 - Math.random() * effectWidth * 0.2
            }
          }
        }
        
        // Clamp to ensure particles stay within column bounds
        xOffset = Math.max(-effectWidth / 2, Math.min(effectWidth / 2, xOffset))
        
        this.x = centerX + xOffset
        this.startX = this.x
        
        // Start above canvas
        this.startY = -20 - Math.random() * 30
        this.y = this.startY
        
        // 30% smaller sizes: 8px -> 5.6px, 24px -> 16.8px
        this.baseSize = 5.6
        this.maxSize = 16.8
        this.currentSize = this.baseSize
        
        // Vertical size (long side) and horizontal size (short side) for 2:3 aspect ratio
        this.width = this.currentSize * 0.67
        this.height = this.currentSize
        
        // Travel time: 150-300ms (randomized per particle)
        this.travelTime = Math.random() * 150 + 150 // 150-300ms
        
        // Start time: staggered over 1750ms, with more particles between 0ms and 750ms
        // Use weighted random distribution to bias toward 0-750ms window
        const random = Math.random()
        if (random < 0.6) {
          // 60% of particles in the 0-750ms window (peak period)
          this.birthOffset = Math.random() * 750 // 0-750ms
        } else if (random < 0.8) {
          // 20% of particles in the 750-1000ms window
          this.birthOffset = 750 + Math.random() * 250 // 750-1000ms
        } else {
          // 20% of particles in the 1000-1750ms window
          this.birthOffset = 1000 + Math.random() * 750 // 1000-1750ms
        }
        
        this.baseOpacity = Math.random() * 0.3 + 0.7 // Randomize between 70% and 100%
        this.opacity = this.baseOpacity
        
        // Calculate constant speed for linear motion
        // Particles flow fully off bottom to cover character's off-screen legs
        const totalDistance = canvas.height + 200 // Top to well below bottom
        this.speedY = totalDistance / this.travelTime // Pixels per ms
        
        // Zig-zag pattern: 24px side movement for every 144px downward movement
        // Each particle gets a random phase offset so they don't all zig-zag in sync
        this.zigzagPhase = Math.random() * Math.PI * 2 // Random phase offset (0 to 2π)
        this.zigzagAmplitude = 24 // 24px horizontal movement
        this.zigzagPeriod = 144 // 144px vertical period
      }
      
      update(elapsed) {
        // Stop updating if effect is complete (1750ms)
        if (elapsed >= 1750) {
          this.currentSize = 0
          this.opacity = 0
          return
        }
        
        const particleAge = elapsed - this.birthOffset
        
        // Don't update if not born yet or already finished
        if (particleAge < 0 || particleAge > this.travelTime) {
          if (particleAge > this.travelTime) {
            this.currentSize = 0
            this.opacity = 0
          }
          return
        }
        
        // Opacity fade-out for last 700ms of effect (from 1050ms to 1750ms)
        if (elapsed >= 1050) {
          const fadeProgress = (elapsed - 1050) / 700 // 0 to 1 over 700ms
          this.opacity = this.baseOpacity * (1 - fadeProgress) // Linear fade to transparent
        } else {
          this.opacity = this.baseOpacity
        }
        
        // Size animation - start small at top, grow to full size at bottom
        // Linear growth from baseSize to maxSize over the entire travel time
        const sizeProgress = particleAge / this.travelTime // 0 to 1 over travel time
        this.currentSize = this.baseSize + (this.maxSize - this.baseSize) * sizeProgress
        
        // Update oval dimensions
        this.width = this.currentSize * 0.67
        this.height = this.currentSize
        
        // Linear vertical motion (no easing) - constant speed
        this.y = this.startY + (this.speedY * particleAge)
        
        // Rounded zig-zag horizontal motion: 24px side movement for every 144px downward
        // Use sine wave for smooth rounded corners
        const verticalDistance = this.y - this.startY
        const zigzagOffset = this.zigzagAmplitude * Math.sin((2 * Math.PI * verticalDistance / this.zigzagPeriod) + this.zigzagPhase)
        this.x = this.startX + zigzagOffset
        
        // Particles continue flowing off bottom (covering character's off-screen legs)
        // Only stop if they've traveled their full distance
        if (this.y > canvas.height + 200) {
          this.currentSize = 0
          this.opacity = 0
        }
      }
      
      draw() {
        if (this.currentSize <= 0) return
        
        ctx.save()
        
        // Reduced glow effect
        const glowSize = this.currentSize * 2
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowSize)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.5})`)
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.2})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, glowSize * 0.67, glowSize, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Core bright particle - oval with 2:3 aspect ratio (vertical)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }
    }
    
    // Create particles - 50% more (1200 total)
    const particleCount = 1200
    const startTime = Date.now()
    particlesRef.current = []
    
    // Create more particles in center (60% center-biased, 40% full-width distribution)
    const centerCount = Math.floor(particleCount * 0.6)
    const fullWidthCount = particleCount - centerCount
    
    for (let i = 0; i < centerCount; i++) {
      const particle = new Particle(startTime, true) // Center-biased (reversed logic)
      particlesRef.current.push(particle)
    }
    
    for (let i = 0; i < fullWidthCount; i++) {
      const particle = new Particle(startTime, false) // Full-width distribution
      particlesRef.current.push(particle)
    }
    
    let isComplete = false
    
    // Animation loop - runs once for 1750ms
    const animate = () => {
      if (!showParticles || isComplete) {
        // Clear canvas when done
        if (isComplete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        return
      }
      
      const elapsed = Date.now() - startTime
      
      // Stop after 1750ms and hide particles
      if (elapsed >= 1750) {
        isComplete = true
        setShowParticles(false)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        return
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(elapsed)
        particle.draw()
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [showParticles, alignment, panelRef])

  // Trigger teleporter sequence when panel becomes visible (only once)
  useEffect(() => {
    if (isVisible && !hasPlayedEffect) {
      setHasPlayedEffect(true) // Mark as played to prevent looping
      
      // Start particles immediately (runs for 1750ms)
      setShowParticles(true)
      
      // Start character flicker fade-in after 500ms delay, lasts 1250ms
      // Character completes at 500ms + 1250ms = 1750ms
      teleporterTimeoutRef.current = setTimeout(() => {
        setShowCharacter(true)
      }, 500)
      
      // Start words animation 500ms after character completes flicker fade-in
      // Character completes at 1750ms, so first bubble appears at 2250ms
      wordsDelayTimeoutRef.current = setTimeout(() => {
        setCanStartWords(true)
      }, 2250) // 500ms delay + 1250ms flicker + 500ms after completion
    }
  }, [isVisible, hasPlayedEffect])

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
      if (teleporterTimeoutRef.current) {
        clearTimeout(teleporterTimeoutRef.current)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
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

      {/* Teleporter particle effect - separate from character */}
      {showParticles && (
        <canvas 
          ref={canvasRef}
          className="teleporter-particles"
        />
      )}

      {/* Character */}
      {picSrc && (
        <div className="quote-panel-character" style={characterStyle}>
          <img 
            src={picSrc} 
            alt={name || 'Character'}
            className={showCharacter ? 'character-materializing' : ''}
          />
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

