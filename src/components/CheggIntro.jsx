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
  const [currentWord, setCurrentWord] = useState(-1)
  const bubbleTimeoutRef = useRef(null)

  const startWordSequence = (wordIndex) => {
    if (wordIndex >= 3) {
      return
    }

    setCurrentWord(wordIndex)
    bubbleTimeoutRef.current = setTimeout(() => {
      startWordSequence(wordIndex + 1)
    }, 500)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)
            setHasAnimated(true)
            
            // Start video playback
            if (videoRef.current) {
              videoRef.current.play().catch((error) => {
                // Ignore autoplay errors (user interaction may be required)
                console.log('Video autoplay prevented:', error)
              })
            }
            
            // Start word sequence after me image transition (200ms)
            setTimeout(() => {
              startWordSequence(0)
            }, 200)
          }
        })
      },
      { threshold: 0.67 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current)
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
      {/* Background */}
      <div className="chegg-intro-bg" />
      
      {/* Background images */}
      <img
        src="/img/chegg/chegg-sanfran-window.svg"
        alt=""
        className="chegg-intro-bg-image chegg-intro-bg-sanfran"
      />
      <img
        src="/img/chegg/chegg-video-outlet.svg"
        alt=""
        className="chegg-intro-bg-image chegg-intro-bg-outlet"
      />
      
      {/* Backstory */}
      <Backstory width="340px">
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

      {/* Words - revealed sequentially */}
      <img
        src="/img/chegg/chegg-intro-words1.svg"
        alt="Words 1"
        className={`chegg-intro-words chegg-intro-words1 ${currentWord >= 0 ? 'visible' : ''}`}
      />
      <img
        src="/img/chegg/chegg-intro-words2.svg"
        alt="Words 2"
        className={`chegg-intro-words chegg-intro-words2 ${currentWord >= 1 ? 'visible' : ''}`}
      />
      <img
        src="/img/chegg/chegg-intro-words3.svg"
        alt="Words 3"
        className={`chegg-intro-words chegg-intro-words3 ${currentWord >= 2 ? 'visible' : ''}`}
      />

      {/* Skills used image */}
      <img
        src="/img/chegg/chegg-skills-used.svg"
        alt="Skills used"
        className="chegg-intro-skills-used"
      />
    </div>
  )
}

export default CheggIntro

