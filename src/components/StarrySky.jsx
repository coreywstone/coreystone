import { useEffect, useRef } from 'react'
import './StarrySky.css'

function StarrySky() {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const starsRef = useRef([])
  const planetsRef = useRef([])
  const shootingStarsRef = useRef([])
  const lastShootingStarRef = useRef(Date.now())
  const containerRef = useRef(null)
  const particlesRef = useRef([])
  const mousePosRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, prevTime: Date.now() })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    
    let width = 0
    let height = 0
    const starColors = ['#FFFFFF', '#B8C9F4', '#8199E9', '#CED4E0']
    const planetColors = ['#B8C9F4', '#8199E9', '#CED4E0']
    const spaceDustColors = ['#FFFFFF', '#B8C9F4', '#8199E9', '#FFC654']
    const MAX_PARTICLES = 300

    // Initialize canvas size
    const updateCanvasSize = () => {
      if (container) {
        const rect = container.getBoundingClientRect()
        width = rect.width || container.offsetWidth
        height = rect.height || container.offsetHeight
        canvas.width = width
        canvas.height = height
      }
    }

    // Create stars
    const createStars = () => {
      const stars = []
      const numStars = Math.floor((width * height) / 8000) // ~200-300 stars for typical sizes
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5, // 0.5 to 2px
          brightness: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.02 + 0.01, // 0.01 to 0.03
          color: starColors[Math.floor(Math.random() * starColors.length)],
          hasGlow: Math.random() > 0.7 // 30% of stars have glow
        })
      }
      starsRef.current = stars
    }

    // Create planets
    const createPlanets = () => {
      const planets = []
      const numPlanets = 3
      
      for (let i = 0; i < numPlanets; i++) {
        planets.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6), // Keep planets in upper portion
          size: Math.random() * 8 + 4, // 4 to 12px
          color: planetColors[Math.floor(Math.random() * planetColors.length)],
          glowIntensity: Math.random() * 0.3 + 0.4 // 0.4 to 0.7
        })
      }
      planetsRef.current = planets
    }

    // Create a shooting star
    const createShootingStar = () => {
      const angle = Math.random() * Math.PI * 0.3 + Math.PI * 0.85 // 153-198 degrees (diagonal down)
      const startX = Math.random() * width * 0.8 + width * 0.1
      const startY = Math.random() * (height * 0.4) // Upper portion
      const length = Math.random() * 80 + 60 // 60-140px
      const speed = Math.random() * 3 + 2 // 2-5px per frame
      
      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        angle: angle,
        length: length,
        opacity: 1,
        speed: speed,
        life: 0
      })
    }

    // Draw star with optional glow
    const drawStar = (star, opacity) => {
      const fadeOpacity = getFadeOpacity(star.y) * opacity
      if (fadeOpacity <= 0) return

      ctx.save()
      ctx.globalAlpha = fadeOpacity

      if (star.hasGlow && star.brightness > 0.8) {
        // Draw glow for brighter stars
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        )
        gradient.addColorStop(0, star.color)
        gradient.addColorStop(0.3, star.color + '80') // 50% opacity
        gradient.addColorStop(1, star.color + '00') // Transparent
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw star
      ctx.fillStyle = star.color
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Draw planet with glow
    const drawPlanet = (planet) => {
      const fadeOpacity = getFadeOpacity(planet.y)
      if (fadeOpacity <= 0) return

      ctx.save()
      ctx.globalAlpha = fadeOpacity

      // Outer glow
      const outerGradient = ctx.createRadialGradient(
        planet.x, planet.y, 0,
        planet.x, planet.y, planet.size * 2.5
      )
      outerGradient.addColorStop(0, planet.color + Math.floor(planet.glowIntensity * 255).toString(16).padStart(2, '0'))
      outerGradient.addColorStop(0.5, planet.color + Math.floor(planet.glowIntensity * 128).toString(16).padStart(2, '0'))
      outerGradient.addColorStop(1, planet.color + '00')
      
      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.size * 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Planet body
      const innerGradient = ctx.createRadialGradient(
        planet.x - planet.size * 0.3, planet.y - planet.size * 0.3, 0,
        planet.x, planet.y, planet.size
      )
      innerGradient.addColorStop(0, planet.color)
      innerGradient.addColorStop(1, planet.color + 'CC')
      
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Draw shooting star
    const drawShootingStar = (shootingStar) => {
      const fadeOpacity = getFadeOpacity(shootingStar.y) * shootingStar.opacity
      if (fadeOpacity <= 0) return

      ctx.save()
      ctx.globalAlpha = fadeOpacity
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      // Trail extends backwards from the head (opposite to movement direction)
      const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length
      const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length

      // Create gradient for trail (bright at head, faded at tail)
      const gradient = ctx.createLinearGradient(
        shootingStar.x, shootingStar.y,
        tailX, tailY
      )
      gradient.addColorStop(0, '#FFFFFF')
      gradient.addColorStop(0.5, '#B8C9F4')
      gradient.addColorStop(1, '#8199E900')

      ctx.strokeStyle = gradient
      ctx.beginPath()
      ctx.moveTo(tailX, tailY)
      ctx.lineTo(shootingStar.x, shootingStar.y)
      ctx.stroke()

      // Add bright head (sphere) at the front
      ctx.fillStyle = '#FFFFFF'
      ctx.beginPath()
      ctx.arc(shootingStar.x, shootingStar.y, 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    // Calculate fade opacity based on vertical position
    const getFadeOpacity = (y) => {
      if (y <= height * 0.5) {
        return 1 // Fully visible in top half
      } else {
        // Fade from 1 to 0 in bottom half
        const fadeProgress = (y - height * 0.5) / (height * 0.5)
        return Math.max(0, 1 - fadeProgress)
      }
    }

    // Create space-dust particles
    const createSpaceDustParticles = (mouseX, mouseY, speed) => {
      // Limit particle count to prevent performance issues
      if (particlesRef.current.length >= MAX_PARTICLES) {
        return
      }

      // Calculate number of particles based on speed (1 particle per 5-10px of movement)
      const numParticles = Math.min(Math.floor(speed / 5), 10)
      
      for (let i = 0; i < numParticles; i++) {
        if (particlesRef.current.length >= MAX_PARTICLES) break

        // Random angle for outward direction (360 degrees)
        const angle = Math.random() * Math.PI * 2
        // Velocity magnitude based on mouse speed (20-60px/s scaled)
        const baseVelocity = 0.3 + (speed / 100) * 0.5
        const velocity = baseVelocity + Math.random() * 0.3

        const initialOpacity = 0.8 + Math.random() * 0.2
        particlesRef.current.push({
          x: mouseX + (Math.random() - 0.5) * 4, // Small random offset
          y: mouseY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 2 + 1, // 1-3px
          color: spaceDustColors[Math.floor(Math.random() * spaceDustColors.length)],
          opacity: initialOpacity,
          initialOpacity: initialOpacity,
          life: 0,
          maxLife: 0.5 + Math.random() * 1.0 // 0.5-1.5 seconds
        })
      }
    }

    // Update space-dust particles
    const updateSpaceDustParticles = () => {
      const deltaTime = 0.016 // ~60fps
      
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Update life and opacity
        particle.life += deltaTime
        const lifeProgress = particle.life / particle.maxLife
        particle.opacity = Math.max(0, (1 - lifeProgress) * particle.initialOpacity || particle.opacity)
        
        // Remove if faded out or out of bounds
        if (particle.opacity <= 0 || 
            particle.x < -50 || particle.x > width + 50 || 
            particle.y < -50 || particle.y > height + 50) {
          return false
        }
        
        return true
      })
    }

    // Draw space-dust particle
    const drawSpaceDustParticle = (particle) => {
      const fadeOpacity = getFadeOpacity(particle.y) * particle.opacity
      if (fadeOpacity <= 0) return

      ctx.save()
      ctx.globalAlpha = fadeOpacity

      // Draw sparkly glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      )
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(0.5, particle.color + '80')
      gradient.addColorStop(1, particle.color + '00')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw particle core
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const currentTime = Date.now()

      // Update and draw stars
      starsRef.current.forEach(star => {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.2 + 0.8 // Oscillate between 0.6 and 1.0
        const opacity = star.brightness * twinkle
        drawStar(star, opacity)
      })

      // Draw planets
      planetsRef.current.forEach(planet => {
        drawPlanet(planet)
      })

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(shootingStar => {
        shootingStar.life += shootingStar.speed
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed
        shootingStar.opacity = Math.max(0, 1 - (shootingStar.life / 150))

        if (shootingStar.opacity > 0 && shootingStar.x < width + 100 && shootingStar.y < height + 100) {
          drawShootingStar(shootingStar)
          return true
        }
        return false
      })

      // Occasionally create new shooting stars (every 2-4 seconds for more activity)
      if (currentTime - lastShootingStarRef.current > 2000 + Math.random() * 2000) {
        createShootingStar()
        lastShootingStarRef.current = currentTime
      }

      // Update and draw space-dust particles
      updateSpaceDustParticles()
      particlesRef.current.forEach(particle => {
        drawSpaceDustParticle(particle)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Initialize
    const init = () => {
      updateCanvasSize()
      if (width > 0 && height > 0) {
        createStars()
        createPlanets()
        animate()
      }
    }

    // Handle resize
    const handleResize = () => {
      updateCanvasSize()
      if (width > 0 && height > 0) {
        createStars()
        createPlanets()
      }
    }

    // Initial setup
    // Use a small delay to ensure container has dimensions
    const initTimeout = setTimeout(() => {
      init()
    }, 10)

    // Use ResizeObserver for better size tracking
    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(container)

    // Also add window resize listener as fallback
    let resizeTimeout
    const resizeHandler = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 250)
    }
    window.addEventListener('resize', resizeHandler)

    // Mouse tracking for space-dust particles
    const aboutSection = container.closest('.about-section')
    
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Only emit particles if mouse is within bounds
      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        const currentTime = Date.now()
        const mouse = mousePosRef.current
        
        // Calculate speed (distance / time)
        const timeDelta = Math.max(currentTime - mouse.prevTime, 1) // Prevent division by zero
        const dx = mouseX - mouse.prevX
        const dy = mouseY - mouse.prevY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const speed = distance / timeDelta * 16.67 // Normalize to ~60fps reference

        // Update mouse position and time
        mouse.x = mouseX
        mouse.y = mouseY
        mouse.prevX = mouseX
        mouse.prevY = mouseY
        mouse.prevTime = currentTime

        // Create particles based on speed (only if mouse moved)
        if (speed > 0.1) {
          createSpaceDustParticles(mouseX, mouseY, speed)
        }
      }
    }

    if (aboutSection) {
      aboutSection.addEventListener('mousemove', handleMouseMove)
    }

    // Cleanup
    return () => {
      clearTimeout(initTimeout)
      resizeObserver.disconnect()
      window.removeEventListener('resize', resizeHandler)
      const aboutSectionForCleanup = container?.closest('.about-section')
      if (aboutSectionForCleanup) {
        aboutSectionForCleanup.removeEventListener('mousemove', handleMouseMove)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="starry-sky-container">
      <canvas ref={canvasRef} className="starry-sky-canvas" />
    </div>
  )
}

export default StarrySky
