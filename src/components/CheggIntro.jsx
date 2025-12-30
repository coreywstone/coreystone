import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import VideoControls from './VideoControls'
import './CheggIntro.css'

function CheggIntro() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const videoRef = useRef(null)
  const [showControls, setShowControls] = useState(false)
  
  // Random rotations for burst explosions (generated once on mount)
  const [rotation75, setRotation75] = useState(() => Math.random() * 40 - 20) // -20 to 20
  const [rotation8, setRotation8] = useState(() => Math.random() * 40 - 20) // -20 to 20

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)
            setHasAnimated(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [hasAnimated])

  const handleVideoClick = (e) => {
    // Don't toggle if clicking a button or controls
    if (e.target.tagName === 'BUTTON' || e.target.closest('.video-controls')) return
    
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  return (
    <div ref={containerRef} className="chegg-intro">
      {/* Background gradient */}
      <div className="chegg-intro-bg" />
      
      {/* Backstory */}
      <Backstory width="380px">
        Chegg's "Skills" division (fka Thinkful) has 75 staff and sells a B2B2C async adult upskilling SaaS with human coaches.
      </Backstory>

      {/* Video container at top-right */}
      <div 
        className="chegg-intro-video-container"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handleVideoClick}
      >
        <video
          ref={videoRef}
          className="chegg-intro-video"
          src="/img/chegg/chegg-sizzle-reel-rect720p.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <VideoControls videoRef={videoRef} visible={showControls} />
      </div>

      {/* But-howww image below video */}
      <img
        src="/img/chegg/but-howww.svg"
        alt="But how?"
        className={`chegg-intro-but-howww ${isVisible ? 'animate' : ''}`}
      />

      {/* Me image at bottom-left */}
      <img
        src="/img/me/me-head-shoulders-on-bottom-left.svg"
        alt="Corey Stone"
        className={`chegg-intro-me ${isVisible ? 'animate' : ''}`}
      />

      {/* Talk bubble */}
      <img
        src="/img/chegg/chegg-intro-bubble.svg"
        alt="Talk bubble"
        className={`chegg-intro-bubble ${isVisible ? 'animate' : ''}`}
      />

      {/* 75% burst */}
      <div className={`chegg-intro-burst-75-container ${isVisible ? 'animate' : ''}`}>
        <img
          src="/img/chegg/chegg-75percent-burst.svg"
          alt="75%"
          className="chegg-intro-burst-75"
          style={{ '--initial-rotation': `${rotation75}deg` }}
        />
      </div>

      {/* 8% burst */}
      <div className={`chegg-intro-burst-8-container ${isVisible ? 'animate' : ''}`}>
        <img
          src="/img/chegg/chegg-8percent-burst.svg"
          alt="8%"
          className="chegg-intro-burst-8"
          style={{ '--initial-rotation': `${rotation8}deg` }}
        />
      </div>
    </div>
  )
}

export default CheggIntro

