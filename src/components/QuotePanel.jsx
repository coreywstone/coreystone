import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
  alignment = 'left', // 'left' or 'right'
  linkedInUrl = null,
  panelIndex = 0 // 0 for first panel, 1 for second panel
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
  const [isTitleHovered, setIsTitleHovered] = useState(false)
  const [isCharacterHovered, setIsCharacterHovered] = useState(false)
  const [projectileInFlight, setProjectileInFlight] = useState(false)
  const [projectileData, setProjectileData] = useState(null)
  const [splatData, setSplatData] = useState(null)
  const [showForceField, setShowForceField] = useState(false)
  const [showPlasmaGun, setShowPlasmaGun] = useState(false)
  const [plasmaGunRaised, setPlasmaGunRaised] = useState(false)
  const [plasmaGunLowering, setPlasmaGunLowering] = useState(false)
  const [plasmaParticles, setPlasmaParticles] = useState([])
  const [neonColor, setNeonColor] = useState(null)
  const panelRef = useRef(null)
  const bgRef = useRef(null)
  const bubbleTimeoutRef = useRef(null)
  const wordsDelayTimeoutRef = useRef(null)
  const teleporterTimeoutRef = useRef(null)
  const lastProjectileRef = useRef(null) // Track last selected projectile to avoid repeats
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const particlesRef = useRef([])
  const projectileAnimationRef = useRef(null)
  const characterImageRef = useRef(null)

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

  // Helper function to create super bright neon version of color
  const createNeonColor = (hex) => {
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
    
    // Make super bright neon: max saturation, high lightness
    s = 1.0 // Maximum saturation
    l = 0.85 // High lightness for brightness
    
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
            // Also create and store neon color for plasma particles
            const neon = createNeonColor(color)
            setNeonColor(neon)
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

  // Start particle emission from plasma gun
  const startParticleEmission = () => {
    if (!panelRef.current) return

    // Use neon color if available, otherwise create from title color
    let particleColor = neonColor
    if (!particleColor && titleColor) {
      particleColor = createNeonColor(titleColor)
      setNeonColor(particleColor)
    }
    if (!particleColor) {
      particleColor = '#00FFFF' // Fallback cyan
    }

    // Get gun position - center-center of the gun image
    const panelRect = panelRef.current.getBoundingClientRect()
    
    // Find the actual gun image element to get its exact position and size
    // Use a small delay to ensure the gun is rendered and positioned
    setTimeout(() => {
      const gunImage = panelRef.current?.querySelector('.quote-panel-plasma-gun.raised')
      if (!gunImage) {
        // Fallback: estimate based on panel and gun size
        const gunWidth = 300 // max-width
        const gunHeight = 300 // max-height
        
        let gunCenterX
        if (alignment === 'left') {
          gunCenterX = panelRect.left + gunWidth / 2
        } else {
          gunCenterX = panelRect.right - gunWidth / 2
        }
        // 40% from top of gun (gun bottom is at panel bottom, so 40% from top = 60% from bottom)
        const gunCenterY = panelRect.bottom - gunHeight * 0.6
        
        // Start particle emission with estimated position
        startParticleEmissionWithPosition(gunCenterX, gunCenterY)
      } else {
        const gunRect = gunImage.getBoundingClientRect()
        // Particle emission: left: 50%, top: 40% relative to gun's area
        const gunCenterX = gunRect.left + gunRect.width / 2 // 50% horizontally
        const gunCenterY = gunRect.top + gunRect.height * 0.4 // 40% from top
        
        // Start particle emission with actual gun position
        startParticleEmissionWithPosition(gunCenterX, gunCenterY)
      }
    }, 50) // Small delay to ensure gun is rendered
  }

  // Start particle emission with specific gun position
  const startParticleEmissionWithPosition = (gunCenterX, gunCenterY) => {
    if (!panelRef.current) return

    // Use neon color if available, otherwise create from title color
    // Ensure 100% saturation for neon plasma look
    let particleColor = neonColor
    if (!particleColor && titleColor) {
      particleColor = createNeonColor(titleColor)
      setNeonColor(particleColor)
    }
    if (!particleColor) {
      particleColor = '#00FFFF' // Fallback cyan
    }
    
    // Create neon variant: maximize saturation and brightness/lightness
    const createNeonVariant = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      
      const rNorm = r / 255
      const gNorm = g / 255
      const bNorm = b / 255
      
      const max = Math.max(rNorm, gNorm, bNorm)
      const min = Math.min(rNorm, gNorm, bNorm)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
        // For grayscale, use a bright cyan as fallback
        h = 0.5 // Cyan hue
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        
        switch (max) {
          case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break
          case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break
          case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break
        }
      }
      
      // Maximize saturation and brightness for neon effect
      s = 1.0 // Maximum saturation (100%)
      l = 0.95 // Very high lightness/brightness (95%) for maximum neon glow
      
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
    
    particleColor = createNeonVariant(particleColor)

    // Create 105-210 particles (decreased by 30% from 150-300)
    const particleCount = Math.floor(Math.random() * 106) + 105 // 105-210 particles
    const particles = []
    const startTime = Date.now()

    // Randomize final destination between 10%-90% width and 5%-95% height
    const minX = window.innerWidth * 0.10
    const maxX = window.innerWidth * 0.90
    const minY = window.innerHeight * 0.05
    const maxY = window.innerHeight * 0.95

    // Stagger launch over 2 seconds (like holding trigger)
    const staggerDuration = 2000 // 2 seconds

    for (let i = 0; i < particleCount; i++) {
      // Random target position within specified bounds
      const targetX = minX + Math.random() * (maxX - minX)
      const targetY = minY + Math.random() * (maxY - minY)
      
      // Random travel time (doubled: 600-1000ms)
      const travelTime = 600 + Math.random() * 400 // 600-1000ms
      
      // Stagger start times over 2 seconds
      const staggerTime = (i / particleCount) * staggerDuration
      
      particles.push({
        id: `particle-${i}-${startTime}`,
        startX: gunCenterX, // Center of gun
        startY: gunCenterY, // Center of gun
        targetX,
        targetY,
        travelTime,
        startTime: startTime + staggerTime, // Staggered over 2 seconds
        size: 5, // Start at 5px
        finalSize: 13 + Math.random() * 117, // End at 13-130px (increased by 30% from 10-100px)
        stuck: false,
        sliding: false,
        currentX: gunCenterX,
        currentY: gunCenterY,
        hitTime: null, // When particle hit the screen
        springOffsetX: 0, // Spring effect offset
        springOffsetY: 0,
        springVelocityX: 0, // Spring velocity (will be set on hit)
        springVelocityY: 0 // Spring velocity (will be set on hit)
      })
    }

    setPlasmaParticles(particles)
    
    // Animate particles
    animateParticles(particles, startTime, gunCenterX, gunCenterY)
  }

  // Animate plasma particles
  const animateParticles = (initialParticles, startTime, gunViewportX, gunViewportY) => {
    let particles = [...initialParticles]
    let gunLowered = false
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      
      const updatedParticles = particles.map(particle => {
        const particleElapsed = elapsed - (particle.startTime - startTime)
        const progress = Math.min(Math.max(particleElapsed / particle.travelTime, 0), 1)
        
        if (progress >= 1 && !particle.stuck) {
          // Particle has reached screen - stick for 1 second with spring effect
          particle.stuck = true
          particle.stuckTime = Date.now()
          particle.hitTime = Date.now()
          particle.size = particle.finalSize
          particle.currentX = particle.targetX
          particle.currentY = particle.targetY
          // Initialize spring with random velocity on hit
          particle.springVelocityX = (Math.random() - 0.5) * 20 // Random velocity -10 to 10
          particle.springVelocityY = (Math.random() - 0.5) * 20
        } else if (particle.stuck) {
          const stuckElapsed = Date.now() - particle.stuckTime
          
          // Spring effect: jiggle when hitting screen
          if (stuckElapsed < 1000) {
            // Apply spring physics for first second
            const springStrength = 0.15 // Spring constant
            const damping = 0.85 // Damping factor
            
            // Spring force pulls back to target position
            const springForceX = -particle.springOffsetX * springStrength
            const springForceY = -particle.springOffsetY * springStrength
            
            // Update velocity with spring force and damping
            particle.springVelocityX = (particle.springVelocityX + springForceX) * damping
            particle.springVelocityY = (particle.springVelocityY + springForceY) * damping
            
            // Update position
            particle.springOffsetX += particle.springVelocityX
            particle.springOffsetY += particle.springVelocityY
            
            // Apply offset to current position
            particle.currentX = particle.targetX + particle.springOffsetX
            particle.currentY = particle.targetY + particle.springOffsetY
          }
          
          if (stuckElapsed >= 1000 && !particle.sliding) {
            // Start sliding down after 1 second
            particle.sliding = true
            particle.slideStartTime = Date.now()
            particle.slideStartY = particle.currentY
            
            // Start lowering gun when first particle starts sliding
            if (!gunLowered) {
              gunLowered = true
              setPlasmaGunLowering(true)
            }
          } else if (particle.sliding) {
            // Slide down over 2 seconds with ease-in
            const slideElapsed = Date.now() - particle.slideStartTime
            const slideProgress = Math.min(slideElapsed / 2000, 1)
            // Ease-in: progress^2
            const easedProgress = slideProgress * slideProgress
            particle.currentY = particle.slideStartY + (window.innerHeight + 100 - particle.slideStartY) * easedProgress
            // Maintain spring offset during slide
            particle.currentX = particle.targetX + particle.springOffsetX
          }
        } else {
          // Particle traveling toward screen
          const easedProgress = progress * progress // Ease-in (progress^2)
          particle.currentX = particle.startX + (particle.targetX - particle.startX) * easedProgress
          particle.currentY = particle.startY + (particle.targetY - particle.startY) * easedProgress
          // Size grows from 5px to finalSize as it approaches
          particle.size = 5 + (particle.finalSize - 5) * easedProgress
        }
        
        return particle
      })

      particles = updatedParticles
      setPlasmaParticles([...particles])

      // Continue animation if particles are still active
      const hasActiveParticles = particles.some(p => 
        !p.sliding || (p.sliding && p.currentY < window.innerHeight + 100)
      )

      if (hasActiveParticles) {
        requestAnimationFrame(animate)
      } else {
        // All particles are done, reset state
        setPlasmaParticles([])
        setShowPlasmaGun(false)
        setPlasmaGunRaised(false)
        setPlasmaGunLowering(false)
        setProjectileInFlight(false)
      }
    }

    animate()
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

  // List of available projectile files (excluding splat)
  // List of available projectile files (excluding deleted ones like sock)
  const projectileFiles = [
    'bananapeel.svg', 'beachball.svg', 'bomb.svg', 'cake.svg',
    'cat.svg', 'cupcake.svg', 'donut.svg', 'duster.svg',
    'egg.svg', 'fish.svg', 'flamingo.svg', 'foamfinger.svg', 'frisbee.svg',
    'frog.svg', 'gnome.svg', 'marshmallow.svg', 'monkey.svg', 'octopus.svg',
    'pie.svg', 'pizzaslice.svg', 'rubberchicken.svg', 'rubberduck.svg',
    'shoe.svg', 'spaghetti.svg', 'teddybear.svg', 'toiletpaper.svg',
    'tomato.svg', 'volleyball.svg', 'waterballoon.svg'
  ]

  // List of projectiles that bounce instead of splatting
  const bouncingProjectiles = [
    'beachball', 'flamingo', 'foamfinger', 'frisbee',
    'rubberchicken', 'rubberduck', 'shoe', 'teddybear',
    'toiletpaper', 'volleyball'
  ]

  // Helper function to extract projectile name from file path
  const getProjectileName = (filePath) => {
    const fileName = filePath.split('/').pop()
    return fileName.replace('.svg', '')
  }

  // Helper function to check if projectile should bounce
  const shouldBounce = (projectileName) => {
    return bouncingProjectiles.includes(projectileName)
  }

  // Handle click on panel
  const handlePanelClick = (e) => {
    // Prevent firing if projectile is already in flight
    if (projectileInFlight) return

    // Don't fire if clicking on title link
    if (e.target.closest('.quote-panel-title-link')) return

    // Get click coordinates relative to panel
    const panelRect = panelRef.current.getBoundingClientRect()
    const clickX = e.clientX - panelRect.left
    const clickY = e.clientY - panelRect.top

    // Check if click is on character image (for future feature)
    const isCharacterClick = characterImageRef.current && 
      e.target === characterImageRef.current || 
      characterImageRef.current.contains(e.target)

    // Randomly select a projectile (excluding the last one to avoid repeats)
    const availableProjectiles = lastProjectileRef.current 
      ? projectileFiles.filter(p => p !== lastProjectileRef.current)
      : projectileFiles
    
    // Fallback to all projectiles if only one option (shouldn't happen, but safety check)
    const projectilesToChooseFrom = availableProjectiles.length > 0 ? availableProjectiles : projectileFiles
    const randomProjectile = projectilesToChooseFrom[Math.floor(Math.random() * projectilesToChooseFrom.length)]
    
    // Store the selected projectile for next time
    lastProjectileRef.current = randomProjectile
    
    const projectileSrc = `/img/quoters/projectiles/${randomProjectile}`

    // Calculate start position (bottom center of viewport)
    // Top-center of projectile should spawn just below bottom center of viewport
    const viewportCenterX = window.innerWidth / 2
    // Since projectile is 400px tall and we use translate(-50%, -50%) for center alignment,
    // to have top-center just below viewport, position center at: viewport bottom + half height + offset
    const projectileHeight = 400
    const viewportBottomY = window.innerHeight + (projectileHeight / 2) + 10 // Center position for top-center to be just below

    // Calculate target position (click point relative to panel)
    const targetX = clickX
    const targetY = clickY

    // Launch projectile immediately
    setProjectileInFlight(true)
    launchProjectile({
      projectileSrc,
      startX: viewportCenterX,
      startY: viewportBottomY,
      targetX: targetX + panelRect.left, // Convert to viewport coordinates
      targetY: targetY + panelRect.top,   // Convert to viewport coordinates
      panelRect,
      isCharacterClick
    })
  }

  // Launch projectile with physics-based animation
  const launchProjectile = ({ projectileSrc, startX, startY, targetX, targetY, panelRect: initialPanelRect, isCharacterClick }) => {
    const flightDuration = 1000 // 1 second (reduced from 1.5 seconds)
    const startTime = Date.now()

    // Extract projectile name and check if it should bounce
    const projectileName = getProjectileName(projectileSrc)
    const willBounce = shouldBounce(projectileName)

    // Store initial target in viewport coordinates
    const targetViewportX = targetX
    const targetViewportY = targetY

    // Calculate initial velocity components to hit target in 1 second
    // Using physics: x(t) = x₀ + v₀ₓ * t, y(t) = y₀ + v₀ᵧ * t - 0.5 * g * t²
    const g = 9.8 * 400 // Gravity scaled for pixels (adjust as needed)
    const t = flightDuration / 1000 // Convert to seconds
    
    // Calculate velocities for ease-out trajectory
    // Since we're using ease-out, we need to account for the easing in velocity calculation
    // For ease-out, the final position should still be the target
    const v0x = (targetViewportX - startX) / t
    const v0y = ((targetViewportY - startY) + 0.5 * g * t * t) / t

    // Random rotation direction and speed
    const rotationDirection = Math.random() < 0.5 ? 1 : -1
    const rotationSpeed = (Math.random() * 180 + 90) * rotationDirection // 90-270 degrees over 2s

    // Deformation parameters - oscillating with damping
    const deformationFreqX = Math.random() * 3 + 2 // 2-5 Hz
    const deformationFreqY = Math.random() * 3 + 2 // 2-5 Hz
    const deformationPhaseX = Math.random() * Math.PI * 2
    const deformationPhaseY = Math.random() * Math.PI * 2
    const deformationAmplitudeX = 0.15 // 15% deformation
    const deformationAmplitudeY = 0.15 // 15% deformation

    // Bounce state
    let hasBounced = false
    let bounceTime = null
    let bounceX = null
    let bounceY = null
    let bounceVx = null
    let bounceVy = null
    let postBounceScale = 1

    // Helper function to play sound effect
    const playSound = (soundPath) => {
      try {
        const audio = new Audio(soundPath)
        audio.play().catch(err => {
          console.log('Sound playback failed:', err)
        })
      } catch (err) {
        console.log('Sound loading failed:', err)
      }
    }

    // Helper function to play bounce sound
    const playBounceSound = () => {
      const bounceSounds = ['boing-1.mp3', 'boing-2.mp3', 'boing-3.mp3', 'boing-4.mp3', 'boing-5.mp3', 'boing-6.mp3', 'boing-7.mp3']
      const randomBounce = bounceSounds[Math.floor(Math.random() * bounceSounds.length)]
      const bouncePath = `/img/quoters/projectiles/sounds/${randomBounce}`
      const bounceAudio = new Audio(bouncePath)
      bounceAudio.volume = 1.0
      bounceAudio.play().catch((err) => {
        console.log('Bounce sound failed:', bouncePath, err)
        // Try another bounce sound if first fails
        const remainingSounds = bounceSounds.filter(s => s !== randomBounce)
        if (remainingSounds.length > 0) {
          const anotherBounce = remainingSounds[Math.floor(Math.random() * remainingSounds.length)]
          const anotherAudio = new Audio(`/img/quoters/projectiles/sounds/${anotherBounce}`)
          anotherAudio.volume = 1.0
          anotherAudio.play().catch(() => {
            // Silently fail if all bounce sounds fail
          })
        }
      })
    }

    // Helper function to play sound with fallback
    const playSoundWithFallback = (projName, isBouncing) => {
      if (isBouncing) {
        // For bouncing projectiles, try to play specific sound first
        // Only play boing if specific sound doesn't exist
        const specificSoundPath = `/img/quoters/projectiles/sounds/${projName}.mp3`
        const audio = new Audio(specificSoundPath)
        audio.volume = 1.0
        
        let specificSoundPlayed = false
        let boingPlayed = false
        
        // Check if audio file exists by listening for error event
        audio.addEventListener('error', () => {
          // Sound file doesn't exist - play boing
          if (!specificSoundPlayed && !boingPlayed) {
            boingPlayed = true
            playBounceSound()
          }
        })
        
        // Try to play specific sound
        audio.play()
          .then(() => {
            // Specific sound played successfully - don't play boing
            specificSoundPlayed = true
          })
          .catch(() => {
            // Play promise rejected - check if file exists
            // If readyState is 0, file likely doesn't exist (error event will fire)
            // If readyState > 0, file exists but play() was rejected (e.g., autoplay policy)
            // In that case, we still don't want to play boing since the file exists
            if (audio.readyState === 0) {
              // File doesn't exist - error event will trigger boing
              // But add a small delay to ensure error event fires first
              setTimeout(() => {
                if (!specificSoundPlayed && !boingPlayed) {
                  boingPlayed = true
                  playBounceSound()
                }
              }, 100)
            }
            // If readyState > 0, file exists but couldn't play - don't play boing
          })
      } else {
        // Non-bouncing projectile - play specific sound
        const soundPath = `/img/quoters/projectiles/sounds/${projName}.mp3`
        playSound(soundPath)
      }
    }

    // Start animation immediately
    const animate = () => {
      const elapsed = Date.now() - startTime
      const currentPanelRect = panelRef.current?.getBoundingClientRect() || initialPanelRect

      let viewportX, viewportY, scale, rotation, scaleX, scaleY

      if (!hasBounced && elapsed >= flightDuration) {
        // Projectile has reached target - handle impact
        const impactX = targetViewportX
        const impactY = targetViewportY

        // Check if this is a character click (defend phase)
        if (isCharacterClick) {
          // Character defense: show force field and bounce projectile
          setShowForceField(true)
          
          // Play force field sound
          const forceFieldSound = new Audio('/img/quoters/projectiles/sounds/forcefield.mp3')
          forceFieldSound.volume = 1.0
          forceFieldSound.play().catch(err => {
            console.log('Force field sound failed to play:', err)
          })
          
          // Calculate bounce physics (same as regular bounce)
          hasBounced = true
          bounceTime = Date.now()
          bounceX = impactX
          bounceY = impactY

          const impactVx = (targetViewportX - startX) / t
          const impactVy = ((targetViewportY - startY) + 0.5 * g * t * t) / t - g * t

          const bounceEnergyLossX = 0.6
          const bounceEnergyLossY = 0.3
          bounceVx = impactVx * bounceEnergyLossX
          bounceVy = -Math.abs(impactVy) * bounceEnergyLossY

          postBounceScale = 0.25 * 1.3

          // Play sound effect with fallback
          playSoundWithFallback(projectileName, true)

          // Hide force field after 1 second, then show plasma gun
          setTimeout(() => {
            setShowForceField(false)
            // Start plasma gun attack phase
            setShowPlasmaGun(true)
            setTimeout(() => {
              setPlasmaGunRaised(true)
              // Wait 1 second after gun is fully raised, then start particle emission
              setTimeout(() => {
                // Play plasma gun sound
                const plasmaGunSound = new Audio('/img/quoters/projectiles/sounds/plasmagun.mp3')
                plasmaGunSound.volume = 1.0
                plasmaGunSound.play().catch(err => {
                  console.log('Plasma gun sound failed to play:', err)
                })
                
                startParticleEmission()
              }, 1000) // 1 second delay after gun is raised
            }, 600) // After gun raise animation completes
          }, 1000)
        } else if (willBounce) {
          // Calculate bounce physics
          hasBounced = true
          bounceTime = Date.now()
          bounceX = impactX
          bounceY = impactY

          // Calculate velocity at impact
          // At impact, we've traveled from startX to targetX in time t
          // The x-velocity is approximately constant (maintained)
          const impactVx = (targetViewportX - startX) / t
          
          // For y-velocity at impact, we calculate from the trajectory
          // At impact: y = startY + v0y*t - 0.5*g*t² = targetY
          // So: v0y = (targetY - startY + 0.5*g*t²) / t
          // At impact time t, the y-velocity is: v0y - g*t
          const impactVy = ((targetViewportY - startY) + 0.5 * g * t * t) / t - g * t

          // Bounce: maintain x-velocity, reverse and significantly reduce y-velocity
          // More realistic bounce: less vertical bounce, more horizontal movement
          const bounceEnergyLossX = 0.6 // 60% of x-velocity maintained
          const bounceEnergyLossY = 0.3 // Only 30% of y-velocity for realistic bounce (much less vertical)
          bounceVx = impactVx * bounceEnergyLossX // Maintain x-direction, slightly reduced
          // Reverse y-velocity and reduce it significantly for realistic bounce
          // The bounce should be much smaller vertically - like a real object bouncing
          bounceVy = -Math.abs(impactVy) * bounceEnergyLossY // Much smaller vertical bounce

          // Grow by 30% after bounce (scale was 25% at impact, grow to 32.5%)
          postBounceScale = 0.25 * 1.3

          // Play sound effect with fallback
          playSoundWithFallback(projectileName, true)
        } else {
          // Show splat for non-bouncing projectiles
          setProjectileData(null)
          
          // Try custom splat first, fallback to default
          const customSplatPath = `/img/quoters/projectiles/splats/${projectileName}.svg`
          const defaultSplatPath = `/img/quoters/projectiles/splats/projectile-splat.svg`
          
          // Show splat at target position
          // Store both panel-relative (for reference) and viewport coordinates (for portal rendering)
          const splatX = impactX - currentPanelRect.left
          const splatY = impactY - currentPanelRect.top
          setSplatData({
            x: splatX, // Panel-relative (for reference)
            y: splatY, // Panel-relative (for reference)
            viewportX: impactX, // Viewport coordinates for portal rendering
            viewportY: impactY, // Viewport coordinates for portal rendering
            isCharacterClick,
            splatSrc: customSplatPath // Will try custom, fallback handled in render
          })

          // Play sound effect
          playSoundWithFallback(projectileName, false)

          // Hide splat after 1.5 seconds visible + 500ms fade-out = 2000ms total
          setTimeout(() => {
            setSplatData(null)
            setProjectileInFlight(false)
          }, 2000)

          return
        }
      }

      if (hasBounced) {
        // Post-bounce animation
        const bounceElapsed = (Date.now() - bounceTime) / 1000 // Time since bounce in seconds
        
        // Calculate position after bounce using physics
        viewportX = bounceX + bounceVx * bounceElapsed
        viewportY = bounceY + bounceVy * bounceElapsed + 0.5 * g * bounceElapsed * bounceElapsed

        // Scale grows slightly after bounce (30% larger)
        scale = postBounceScale

        // Continue rotation
        rotation = rotationSpeed + (rotationSpeed * 0.1 * bounceElapsed)

        // No deformation after bounce
        scaleX = 1
        scaleY = 1

        // Check if projectile has exited viewport
        if (viewportY > window.innerHeight + 200) {
          // Projectile has fallen off screen
          setProjectileData(null)
          setProjectileInFlight(false)
          return
        }
      } else {
        // Pre-bounce animation (original flight)
        const progress = Math.min(elapsed / flightDuration, 1)

        // Calculate position using physics (in viewport coordinates)
        // Apply ease-out easing to progress for smoother deceleration
        const easeOutProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
        // Use eased progress to interpolate between start and target
        // This gives ease-out motion while maintaining parabolic trajectory
        viewportX = startX + (targetViewportX - startX) * easeOutProgress
        viewportY = startY + (targetViewportY - startY) * easeOutProgress
        // Add parabolic arc effect using the eased progress
        const arcHeight = 200 // Maximum arc height in pixels
        const arcProgress = 4 * easeOutProgress * (1 - easeOutProgress) // Creates arc shape
        const viewportYWithArc = viewportY - (arcHeight * arcProgress)
        
        // At the end (progress = 1), ensure we land exactly at target (no arc offset)
        viewportY = progress >= 0.99 ? targetViewportY : viewportYWithArc

        // Calculate scale (100% to 25%)
        scale = 1 - (progress * 0.75)

        // Calculate rotation
        rotation = rotationSpeed * progress

        // No deformation (temporarily disabled)
        scaleX = 1
        scaleY = 1
      }

      // Store viewport coordinates for portal rendering
      setProjectileData({
        src: projectileSrc,
        x: viewportX,
        y: viewportY,
        scale,
        rotation,
        scaleX,
        scaleY,
        panelRect: currentPanelRect
      })

      projectileAnimationRef.current = requestAnimationFrame(animate)
    }

    // Start animation immediately
    animate()
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
      if (projectileAnimationRef.current) {
        cancelAnimationFrame(projectileAnimationRef.current)
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
      onClick={handlePanelClick}
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
        <div 
          className="quote-panel-title"
          onMouseEnter={() => linkedInUrl && setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
        >
          {linkedInUrl ? (
            <a 
              href={linkedInUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="quote-panel-title-link"
            >
              <InlineSVG src={titleSrc} alt={name || 'Quote'} />
              {isTitleHovered && (
                <div className="quote-panel-title-tooltip">
                  View their LinkedIn
                </div>
              )}
            </a>
          ) : (
            <InlineSVG src={titleSrc} alt={name || 'Quote'} />
          )}
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
        <div 
          className="quote-panel-character" 
          style={characterStyle}
          onMouseEnter={() => setIsCharacterHovered(true)}
          onMouseLeave={() => setIsCharacterHovered(false)}
        >
          <img 
            ref={characterImageRef}
            src={picSrc} 
            alt={name || 'Character'}
            className={showCharacter ? 'character-materializing' : ''}
          />
        </div>
      )}

      {/* Projectile - rendered via portal at page level */}
      {projectileData && typeof document !== 'undefined' && document.body && createPortal(
        <img
          src={projectileData.src}
          alt="Projectile"
          className="quote-panel-projectile"
          style={{
            position: 'fixed',
            left: `${projectileData.x}px`,
            top: `${projectileData.y}px`,
            transform: `translate(-50%, -50%) scale(${projectileData.scale}) scaleX(${projectileData.scaleX}) scaleY(${projectileData.scaleY}) rotate(${projectileData.rotation}deg)`,
            transformOrigin: 'center center',
            display: 'block',
            opacity: 1,
            visibility: 'visible',
            zIndex: 9999,
            width: '400px',
            height: '400px',
            objectFit: 'contain',
          }}
          onLoad={(e) => {
            const img = e.target
            console.log('Projectile image loaded successfully:', projectileData.src)
            console.log('Image position:', { x: projectileData.x, y: projectileData.y })
            console.log('Image computed style:', {
              display: window.getComputedStyle(img).display,
              visibility: window.getComputedStyle(img).visibility,
              opacity: window.getComputedStyle(img).opacity,
              zIndex: window.getComputedStyle(img).zIndex,
              position: window.getComputedStyle(img).position,
              width: window.getComputedStyle(img).width,
              height: window.getComputedStyle(img).height,
              transform: window.getComputedStyle(img).transform
            })
            console.log('Image bounding rect:', img.getBoundingClientRect())
          }}
          onError={(e) => {
            console.error('Projectile image failed to load:', projectileData.src, e)
          }}
        />,
        document.body
      )}

      {/* Force Field */}
      {showForceField && picSrc && (
        <div 
          className="quote-panel-force-field"
          style={{
            [alignment === 'left' ? 'left' : 'right']: 0,
            bottom: 0
          }}
        >
          <img
            src="/img/quoters/projectiles/attack/forcefield.svg"
            alt="Force Field"
            className={`force-field-flicker ${alignment === 'right' ? 'flipped' : ''}`}
          />
        </div>
      )}

      {/* Plasma Gun */}
      {showPlasmaGun && characterImageRef.current && (
        <img
          src="/img/quoters/projectiles/attack/plasmagun.svg"
          alt="Plasma Gun"
          className={`quote-panel-plasma-gun ${plasmaGunRaised ? 'raised' : ''} ${plasmaGunLowering ? 'lowering' : ''} ${panelIndex % 2 === 1 ? 'flipped' : ''}`}
          style={{
            [alignment === 'left' ? 'left' : 'right']: 0
          }}
        />
      )}

      {/* Plasma Particles - rendered via portal at page level */}
      {plasmaParticles.length > 0 && typeof document !== 'undefined' && document.body && createPortal(
        <div className="plasma-particles-container">
          {plasmaParticles.map(particle => (
            <div
              key={particle.id}
              className="plasma-particle"
              style={{
                position: 'fixed',
                left: `${particle.currentX}px`,
                top: `${particle.currentY}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: neonColor || titleColor || '#00FFFF',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                boxShadow: `0 0 ${particle.size}px ${neonColor || titleColor || '#00FFFF'}`
              }}
            />
          ))}
        </div>,
        document.body
      )}

      {/* Splat - rendered via portal at page level to avoid clipping */}
      {splatData && typeof document !== 'undefined' && document.body && createPortal(
        <img
          src={splatData.splatSrc || "/img/quoters/projectiles/splats/projectile-splat.svg"}
          alt="Splat"
          className="quote-panel-splat"
          style={{
            position: 'fixed',
            left: `${splatData.viewportX || splatData.x}px`,
            top: `${splatData.viewportY || splatData.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
          onError={(e) => {
            // Fallback to default splat if custom splat doesn't exist
            if (e.target.src !== "/img/quoters/projectiles/splats/projectile-splat.svg") {
              e.target.src = "/img/quoters/projectiles/splats/projectile-splat.svg"
            }
          }}
        />,
        document.body
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

