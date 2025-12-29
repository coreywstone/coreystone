import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import './CheggIntro.css'

function CheggIntro() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
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
    if (e.target.tagName === 'BUTTON') return // Don't toggle if clicking a button
    
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
    } else {
      videoRef.current?.play()
      setIsPlaying(true)
    }
  }

  const handlePlayPause = (e) => {
    e.stopPropagation()
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
    } else {
      videoRef.current?.play()
      setIsPlaying(true)
    }
  }

  const handleRewind = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 7)
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
        {showControls && (
          <div className="chegg-intro-video-controls">
            <button onClick={handlePlayPause} className="chegg-video-btn">
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button onClick={handleRewind} className="chegg-video-btn">
              ⏪ 7s
            </button>
          </div>
        )}
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
      <img
        src="/img/chegg/chegg-75percent-burst.svg"
        alt="75%"
        className={`chegg-intro-burst-75 ${isVisible ? 'animate' : ''}`}
        style={{ '--initial-rotation': `${rotation75}deg` }}
      />

      {/* 8% burst */}
      <img
        src="/img/chegg/chegg-8percent-burst.svg"
        alt="8%"
        className={`chegg-intro-burst-8 ${isVisible ? 'animate' : ''}`}
        style={{ '--initial-rotation': `${rotation8}deg` }}
      />
    </div>
  )
}

export default CheggIntro

