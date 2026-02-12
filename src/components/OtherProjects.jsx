import { useEffect, useRef, useState, useCallback } from 'react'
import ProjectCard from './ProjectCard'
import VortexTravelEffect from './VortexTravelEffect'
import './OtherProjects.css'

const CARD_WIDTH = 240
const LEFT_BOUNDARY = 500
const NUM_CARDS = 4
const MIN_ROTATION = -10
const MAX_ROTATION = 10
const FERRIS_WHEEL_SPEED = 0.00015 // Speed of rotation (radians per ms) - clockwise

function OtherProjects() {
  const containerRef = useRef(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const [showVortex, setShowVortex] = useState(false)
  const [pendingUrl, setPendingUrl] = useState(null)
  const [cards, setCards] = useState([])
  const [hoveredCardId, setHoveredCardId] = useState(null)
  const [clickedCardId, setClickedCardId] = useState(null)
  
  const animationFrameRef = useRef(null)
  const cardsDataRef = useRef([])
  const containerSizeRef = useRef({ width: 0, height: 0 })
  const wheelRotationRef = useRef(0) // Current rotation angle of the Ferris wheel
  const animationStartTimeRef = useRef(null)
  const lastWheelRotationRef = useRef(0) // Store rotation when paused
  const pauseStartTimeRef = useRef(null) // Track when pause started

  // Initialize cards in circular layout
  useEffect(() => {
    if (!containerRef.current) return

    const updateContainerSize = () => {
      if (containerRef.current) {
        containerSizeRef.current = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        }
      }
    }
    updateContainerSize()

    // Initialize card positions on the Ferris wheel
    // Layout area is from Left: 500px to right: 100%
    // Calculate center and radius to fill this area
    const layoutWidth = containerSizeRef.current.width - LEFT_BOUNDARY
    const centerX = LEFT_BOUNDARY + layoutWidth / 2
    const centerY = containerSizeRef.current.height / 2
    // Calculate maximum radius that fits within bounds (circular constraint)
    const maxRadiusX = layoutWidth / 2 - CARD_WIDTH / 2
    const maxRadiusY = containerSizeRef.current.height / 2 - CARD_WIDTH / 2
    const maxRadius = Math.min(maxRadiusX, maxRadiusY)
    // Use a base radius that's a bit smaller to avoid boundary collisions
    const baseRadius = maxRadius * 0.85
    
    // Card data - each card can have different content
    const allCardData = [
      // Card 0: Owl (keep)
      {
        image: '/img/owl/owl-thumb.png',
        text: 'Sole designer at mental health B2B SaaS startup',
        url: 'https://coreystone.com/projects/owl.shtml'
      },
      // Card 1: KLF
      {
        image: '/img/klf/klf-thumb.png',
        text: 'Saved millions in enterprise billing delays',
        url: 'https://coreystone.com/projects/klf.shtml'
      },
      // Card 2: ACT
      {
        image: '/img/act/act-test-selection-top.jpg',
        text: 'Reduced ACT test reg from 30 to 7 minutes',
        url: 'https://coreystone.com/projects/myact.shtml'
      },
      // Card 3: HERO Keyboard
      {
        image: '/img/hero/hero-thumb.png',
        text: 'Founded HERO Keyboard',
        url: 'https://coreystone.com/projects/hero.shtml'
      },
    ]
    
    const initialCards = Array.from({ length: NUM_CARDS }, (_, i) => {
      // Each card has a base angle position on the circle (like a seat on a Ferris wheel)
      const baseAngle = (i / NUM_CARDS) * Math.PI * 2
      // Each card has a slightly different radius for loose circle effect (smaller variation)
      const radius = baseRadius + (Math.random() - 0.5) * 40
      
      // Calculate initial position
      const x = centerX + Math.cos(baseAngle) * radius
      const y = centerY + Math.sin(baseAngle) * radius
      
      // Ensure x >= LEFT_BOUNDARY by adjusting if needed
      let finalX = x
      if (x < LEFT_BOUNDARY + CARD_WIDTH / 2) {
        // Adjust to be on the boundary, but keep relative position if possible
        finalX = LEFT_BOUNDARY + CARD_WIDTH / 2
      }
      
      // Initialize rotation between -10 and 10 degrees (cards stay mostly upright)
      const initialRotation = (Math.random() - 0.5) * 20
      
      // Small random velocity for subtle movement
      const vx = (Math.random() - 0.5) * 0.3
      const vy = (Math.random() - 0.5) * 0.3
      const vr = (Math.random() - 0.5) * 0.5
      
      return {
        id: i,
        baseAngle: baseAngle, // Fixed position on the circle
        radius: radius, // Radius from center for this card
        x: finalX,
        y: y,
        rotation: initialRotation,
        vx: vx, // Small random velocity
        vy: vy,
        vr: vr,
        ...allCardData[i], // Add card data (image, text, url)
      }
    })
    
    cardsDataRef.current = initialCards
    setCards(initialCards)
    wheelRotationRef.current = 0
    lastWheelRotationRef.current = 0
    animationStartTimeRef.current = performance.now()

    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  // Animation loop
  useEffect(() => {
    let lastTime = performance.now()
    
    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime
      
      // Update every ~16ms (60fps)
      if (deltaTime < 16) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      const { width, height } = containerSizeRef.current
      // Layout area is from Left: 500px to right: 100%
      const layoutWidth = width - LEFT_BOUNDARY
      const centerX = LEFT_BOUNDARY + layoutWidth / 2
      const centerY = height / 2
      
      // Calculate maximum radius that fits within bounds (circular constraint)
      const maxRadiusX = layoutWidth / 2 - CARD_WIDTH / 2
      const maxRadiusY = height / 2 - CARD_WIDTH / 2
      const maxRadius = Math.min(maxRadiusX, maxRadiusY)
      
      // Update Ferris wheel rotation (clockwise) - pause if any card is hovered
      if (!hoveredCardId) {
        // Not paused - check if we just resumed from a pause
        if (pauseStartTimeRef.current !== null) {
          // We just resumed - adjust animation start time to continue smoothly
          const pauseDuration = currentTime - pauseStartTimeRef.current
          animationStartTimeRef.current = currentTime - (lastWheelRotationRef.current / FERRIS_WHEEL_SPEED)
          pauseStartTimeRef.current = null
        }
        if (animationStartTimeRef.current) {
          const elapsed = currentTime - animationStartTimeRef.current
          wheelRotationRef.current = elapsed * FERRIS_WHEEL_SPEED
          lastWheelRotationRef.current = wheelRotationRef.current
        }
      } else {
        // Paused - use last rotation and track pause start time
        if (pauseStartTimeRef.current === null) {
          pauseStartTimeRef.current = currentTime
        }
        wheelRotationRef.current = lastWheelRotationRef.current
      }
      
      const updatedCards = [...cardsDataRef.current]

      updatedCards.forEach((card, index) => {
        // Skip animation for clicked cards
        if (clickedCardId === card.id) return

        // Handle hovered cards - smoothly rotate to 0, but don't update position
        if (hoveredCardId === card.id) {
          // Interpolate rotation towards 0
          const targetRotation = 0
          const rotationSpeed = 0.15
          card.rotation += (targetRotation - card.rotation) * rotationSpeed
          if (Math.abs(card.rotation) < 0.1) {
            card.rotation = 0
          }
          // Position stays the same (frozen)
        } else {
          // Pause movement if any card is hovered
          if (hoveredCardId !== null) {
            // All cards are paused, don't update position or rotation
          } else {
            // Update rotation (cards stay mostly upright with small variations)
            card.rotation += card.vr
            
            // Clamp rotation to -10° to 10°
            if (card.rotation < MIN_ROTATION) {
              card.rotation = MIN_ROTATION
              card.vr *= -1
            } else if (card.rotation > MAX_ROTATION) {
              card.rotation = MAX_ROTATION
              card.vr *= -1
            }
            
            // Calculate position based on Ferris wheel rotation
            const angle = card.baseAngle + wheelRotationRef.current
            let x = centerX + Math.cos(angle) * card.radius
            let y = centerY + Math.sin(angle) * card.radius
            
            // Apply circular boundary constraint - keep cards within circular bounds
            const dx = x - centerX
            const dy = y - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            // If card would go outside circular boundary, constrain it to the circle
            if (distance > maxRadius) {
              const scale = maxRadius / distance
              x = centerX + dx * scale
              y = centerY + dy * scale
              
              // Also ensure x is within left boundary
              if (x < LEFT_BOUNDARY + CARD_WIDTH / 2) {
                x = LEFT_BOUNDARY + CARD_WIDTH / 2
              }
            } else {
              // Ensure x is still within left boundary even if within circle
              if (x < LEFT_BOUNDARY + CARD_WIDTH / 2) {
                x = LEFT_BOUNDARY + CARD_WIDTH / 2
              }
            }
            
            card.x = x
            card.y = y
          }
        }

        // Collision detection (avoid overlap > 20px) - only when not paused
        if (!hoveredCardId) {
          updatedCards.forEach((otherCard, otherIndex) => {
            if (index === otherIndex || hoveredCardId === otherCard.id || clickedCardId === otherCard.id) return

            const dx = card.x - otherCard.x
            const dy = card.y - otherCard.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = CARD_WIDTH - 20 // Allow 20px overlap

            if (distance < minDistance && distance > 0) {
              // Push cards apart
              const angle = Math.atan2(dy, dx)
              const overlap = minDistance - distance
              const pushX = Math.cos(angle) * overlap * 0.5
              const pushY = Math.sin(angle) * overlap * 0.5

              card.x += pushX
              card.y += pushY
              otherCard.x -= pushX
              otherCard.y -= pushY

              // Adjust velocities
              card.vx += pushX * 0.01
              card.vy += pushY * 0.01
              otherCard.vx -= pushX * 0.01
              otherCard.vy -= pushY * 0.01
            }
          })
        }
      })

      cardsDataRef.current = updatedCards
      setCards([...updatedCards])
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [hoveredCardId, clickedCardId])

  // Intersection observer for words animation
  useEffect(() => {
    const containerElement = containerRef.current
    if (!containerElement) return

    const projectRow = containerElement.closest('.project-row')
    if (!projectRow) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            setTimeout(() => {
              setShowWords(true)
            }, 750)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(projectRow)

    return () => {
      if (projectRow) {
        observer.unobserve(projectRow)
      }
    }
  }, [hasAnimated])

  const handleCardMouseEnter = useCallback((cardId) => {
    setHoveredCardId(cardId)
  }, [])

  const handleCardMouseLeave = useCallback((cardId) => {
    if (clickedCardId !== cardId) {
      setHoveredCardId(null)
    }
  }, [clickedCardId])

  const handleCardTriggerVortex = useCallback((url) => {
    setClickedCardId(hoveredCardId)
    setPendingUrl(url)
    setShowVortex(true)
    
    setTimeout(() => {
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    }, 2500) // Decreased by 500ms from 3000ms
  }, [hoveredCardId])

  const handleVortexComplete = useCallback(() => {
    setShowVortex(false)
    setClickedCardId(null)
    setHoveredCardId(null)
    setPendingUrl(null)
  }, [])

  return (
    <div ref={containerRef} className="other-projects-container">
      <img
        src="/img/me/other-projects-words.svg"
        alt="Other projects words"
        className={`other-projects-words ${showWords ? 'visible' : ''}`}
        onError={(e) => console.error('Failed to load other-projects-words.svg', e)}
      />
      {cards.map((card) => (
        <ProjectCard
          key={card.id}
          image={card.image}
          text={card.text}
          url={card.url}
          style={{
            left: `${card.x - CARD_WIDTH / 2}px`,
            top: `${card.y - CARD_WIDTH / 2}px`,
          }}
          rotation={card.rotation}
          isHovered={hoveredCardId === card.id}
          isClicked={clickedCardId === card.id}
          isTall={card.isTall || false}
          onTriggerVortex={handleCardTriggerVortex}
          onMouseEnter={() => handleCardMouseEnter(card.id)}
          onMouseLeave={() => handleCardMouseLeave(card.id)}
        />
      ))}
      <VortexTravelEffect isActive={showVortex} onComplete={handleVortexComplete} />
    </div>
  )
}

export default OtherProjects
