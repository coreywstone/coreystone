import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import './CheggStaffAI.css'

function CheggStaffAI() {
  const wireRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const [showAsk, setShowAsk] = useState(false)
  const [showHmm, setShowHmm] = useState(false)
  const [currentPersona, setCurrentPersona] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const personaCarouselRef = useRef(null)
  const resultsPanelRef = useRef(null)
  const resultsSvgRef = useRef(null)

  useEffect(() => {
    const wireElement = wireRef.current
    if (!wireElement) return

    let hasScrolled = false
    let initialLayoutStable = false

    const checkVisibility = () => {
      const wireRect = wireElement.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      
      // Calculate how much of the Wire panel is visible vertically
      const wireTop = wireRect.top
      const wireBottom = wireRect.bottom
      
      // Calculate visible height of Wire panel
      const visibleTop = Math.max(wireTop, 0)
      const visibleBottom = Math.min(wireBottom, viewportHeight)
      const visibleHeight = Math.max(0, visibleBottom - visibleTop)
      const wireHeight = wireRect.height
      
      // Trigger when section comes into vertical view (e.g., when any part is visible)
      const visibleRatio = visibleHeight / wireHeight
      
      // Only trigger if user has scrolled (to avoid false positives from initial layout changes)
      // This prevents the animation from triggering when the Intro section grows on initial load
      if (visibleRatio > 0 && !isVisible && hasScrolled) {
        console.log('Wire panel vertically visible, triggering animation', { visibleRatio, visibleHeight, wireHeight })
        setIsVisible(true)
      }
    }

    const handleScroll = () => {
      if (!hasScrolled) {
        hasScrolled = true
      }
      checkVisibility()
    }

    // Wait for layout to stabilize before allowing scroll detection
    // This gives the Intro section time to grow to its final height
    // After this delay, we'll only trigger on actual user scroll
    const layoutStableTimer = setTimeout(() => {
      initialLayoutStable = true
    }, 1000) // 1 second delay to allow layout to fully stabilize

    // Listen to window scroll events for vertical scrolling
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    return () => {
      clearTimeout(layoutStableTimer)
      window.removeEventListener('scroll', handleScroll)
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

  // Show ask image after 1.7 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowAsk(true)
      }, 1700)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Show hmm image at 2.5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowHmm(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  // Persona carousel auto-scroll
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentPersona((prev) => (prev + 1) % 4)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused])

  const handleCarouselClick = () => {
    setCurrentPersona((prev) => (prev + 1) % 4)
  }

  const handleDotClick = (index) => {
    setCurrentPersona(index)
  }

  // Calculate results panel width based on SVG dimensions
  useEffect(() => {
    const panel = resultsPanelRef.current
    const svg = resultsSvgRef.current
    if (!panel || !svg) return

    const calculateWidth = () => {
      const panelHeight = panel.offsetHeight
      const svgScaledHeight = panelHeight * 0.9 // 90% of panel height
      
      // Wait for SVG to load to get its natural dimensions
      if (svg.complete && svg.naturalWidth && svg.naturalHeight) {
        const aspectRatio = svg.naturalWidth / svg.naturalHeight
        const svgScaledWidth = svgScaledHeight * aspectRatio
        const requiredWidth = 48 + svgScaledWidth + 12 // left offset + SVG width + right border
        panel.style.width = `${Math.max(440, requiredWidth)}px`
      } else {
        // If SVG not loaded yet, set a default width
        panel.style.width = '440px'
      }
    }

    // Calculate on load and resize
    if (svg.complete) {
      calculateWidth()
    } else {
      svg.addEventListener('load', calculateWidth)
    }
    
    window.addEventListener('resize', calculateWidth)
    
    return () => {
      svg.removeEventListener('load', calculateWidth)
      window.removeEventListener('resize', calculateWidth)
    }
  }, [])

  return (
    <div className="chegg-staff-ai-panel">
      <Backstory width="340px" className="chegg-staff-ai-backstory">
        Chegg's "Skills" division (fka Thinkful) has 75 staff and sells a B2B2C async adult upskilling SaaS with human coaches.
      </Backstory>
      <div ref={wireRef} className="chegg-staff-ai-wire">
        {/* Wire panel content will go here */}
        <img
          src="/img/me/me-on-wire.svg"
          alt="Corey on wire"
          loading="lazy"
          className={`chegg-staff-ai-me-on-wire ${isVisible ? 'animate' : ''}`}
        />
        <img
          src="/img/chegg/chegg-wire-words.svg"
          alt=""
          loading="lazy"
          className={`chegg-staff-ai-wire-words ${showWords ? 'visible' : ''}`}
        />
        <img
          src="/img/chegg/chegg-wire-ask.svg"
          alt=""
          loading="lazy"
          className={`chegg-staff-ai-wire-ask ${showAsk ? 'visible' : ''}`}
        />
        <img
          src="/img/chegg/chegg-hmm-get-up-to-speed.svg"
          alt=""
          loading="lazy"
          className={`chegg-staff-ai-hmm ${showHmm ? 'visible' : ''}`}
        />
      </div>
      <div className="chegg-staff-ai-personas">
        <Backstory>
          To learn about our business processes and problems, I interviewed our student success coaches, tutors, mentors, and Admission reps.
        </Backstory>
        <div className="chegg-staff-ai-persona-carousel-container">
          <div className="chegg-staff-ai-persona-carousel-header">
            Staff personas I created:
          </div>
          <div 
            ref={personaCarouselRef}
            className="chegg-staff-ai-persona-carousel"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={handleCarouselClick}
          >
            <div 
              className="chegg-staff-ai-persona-carousel-inner"
              style={{ 
                transform: `translateY(calc(-8px - ${currentPersona} * 356px))` 
              }}
            >
              <img src="/img/chegg/chegg-persona1.jpg" alt="Persona 1" loading="lazy" />
              <img src="/img/chegg/chegg-persona2.jpg" alt="Persona 2" loading="lazy" />
              <img src="/img/chegg/chegg-persona3.jpg" alt="Persona 3" loading="lazy" />
              <img src="/img/chegg/chegg-persona4.jpg" alt="Persona 4" loading="lazy" />
            </div>
            <div className="chegg-staff-ai-persona-carousel-dots">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`chegg-staff-ai-persona-carousel-dot ${currentPersona === index ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDotClick(index)
                  }}
                />
              ))}
            </div>
          </div>
          <div className="chegg-staff-ai-persona-carousel-footer">
            <span className="chegg-staff-ai-persona-carousel-footer-learned">I LEARNED:</span> STAFF-FACING INFO IS SPREAD ACROSS MANY INEFFICIENT SILOED TOOLS, RESULTING IN COSTLY WASTED TIME.
          </div>
        </div>
      </div>
      <div ref={resultsPanelRef} className="chegg-staff-ai-results">
        <img 
          ref={resultsSvgRef}
          src="/img/chegg/chegg-staff-ai-result.png"
          alt="AI result"
          className="chegg-staff-ai-results-bg"
          loading="lazy"
        />
        <img 
          src="/img/chegg/chegg-staffai-result-burst.svg"
          alt="Burst"
          className="chegg-staff-ai-results-burst"
          loading="lazy"
        />
        <div className="chegg-staff-ai-results-container">
          <Backstory top={0} left={0} backgroundColor="#262629">
            So, I worked with PM Jordan and two of our AI-savvy data analysts (Ben & Victor) to create this AI-powered consolidated student detail page...
          </Backstory>
          <img 
            src="/img/chegg/chegg-staff-ai-team.jpg"
            alt="AI team"
            className="chegg-staff-ai-results-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

export default CheggStaffAI

