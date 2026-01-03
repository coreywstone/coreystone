import { useState, useEffect, useRef } from 'react'
import InlineSVG from './InlineSVG'
import './VideoControls.css'

function VideoControls({ videoRef, visible = false }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeButton, setActiveButton] = useState(null)
  const [splashData, setSplashData] = useState(null) // { buttonId, droplets: [{ id, x, y }] }
  const buttonClickSound = useRef(null)
  const rewindSound = useRef(null)
  const splashCounterRef = useRef(0)

  // Initialize audio objects
  useEffect(() => {
    buttonClickSound.current = new Audio('/img/ui/buttonclick.mp3')
    rewindSound.current = new Audio('/img/ui/rewind.mp3')
    
    return () => {
      // Cleanup
      if (buttonClickSound.current) {
        buttonClickSound.current.pause()
        buttonClickSound.current = null
      }
      if (rewindSound.current) {
        rewindSound.current.pause()
        rewindSound.current = null
      }
    }
  }, [])

  // Sync playing state with video events
  useEffect(() => {
    const video = videoRef?.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // Set initial state
    setIsPlaying(!video.paused)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoRef])

  const handleButtonDown = (buttonId) => {
    setActiveButton(buttonId)
  }

  const handleButtonUp = (buttonId, shouldSplash = true) => {
    setActiveButton(null)
    // Trigger splash effect on release (but not on mouse leave)
    if (buttonId && shouldSplash) {
      const dropletCount = Math.floor(Math.random() * 7) + 5 // 5-11 droplets
      const buttonRadius = 32 // Button is ~64px diameter, so radius is ~32px
      const droplets = Array.from({ length: dropletCount }, (_, i) => {
        const angle = (i / dropletCount) * Math.PI * 2 // Distribute evenly around circle
        const startDistance = buttonRadius // Start at button edge
        const travelDistance = (40 + Math.random() * 20) * 0.6 // Random travel distance 24-36px (60% of 40-60px)
        const totalDistance = startDistance + travelDistance
        return {
          id: `${buttonId}-${Date.now()}-${i}`,
          x: Math.cos(angle) * totalDistance,
          y: Math.sin(angle) * totalDistance,
          startX: Math.cos(angle) * startDistance,
          startY: Math.sin(angle) * startDistance
        }
      })
      setSplashData({ buttonId, droplets })
      setTimeout(() => {
        setSplashData(null)
      }, 600) // Match animation duration
    }
  }

  const handleButtonClick = (buttonId, action) => {
    // Execute the action
    action()
    // Trigger splash effect on release (for trackpad light tap)
    splashCounterRef.current += 1
    const splashId = splashCounterRef.current
    const dropletCount = Math.floor(Math.random() * 7) + 5 // 5-11 droplets
    const buttonRadius = 32 // Button is ~64px diameter, so radius is ~32px
    const timestamp = Date.now()
    const droplets = Array.from({ length: dropletCount }, (_, i) => {
      const angle = (i / dropletCount) * Math.PI * 2 // Distribute evenly around circle
      const startDistance = buttonRadius // Start at button edge
      const travelDistance = (40 + Math.random() * 20) * 0.6 // Random travel distance 24-36px (60% of 40-60px)
      const totalDistance = startDistance + travelDistance
      return {
        id: `${buttonId}-${splashId}-${i}-${timestamp}-${Math.random()}`,
        x: Math.cos(angle) * totalDistance,
        y: Math.sin(angle) * totalDistance,
        startX: Math.cos(angle) * startDistance,
        startY: Math.sin(angle) * startDistance
      }
    })
    // Always create new splash data to ensure animation triggers
    setSplashData({ buttonId, droplets, splashId })
    setTimeout(() => {
      setSplashData(prev => {
        // Only clear if this is still the current splash
        if (prev && prev.splashId === splashId) {
          return null
        }
        return prev
      })
    }, 600) // Match animation duration
  }

  const handleRestart = (e) => {
    e.stopPropagation()
    handleButtonClick('restart', () => {
      if (videoRef?.current) {
        videoRef.current.currentTime = 0
      }
    })
    // Play button click sound
    if (buttonClickSound.current) {
      buttonClickSound.current.currentTime = 0
      buttonClickSound.current.play().catch(() => {
        // Ignore play() errors (e.g., if user hasn't interacted with page yet)
      })
    }
  }

  const handleRewind = (e) => {
    e.stopPropagation()
    handleButtonClick('rewind', () => {
      if (videoRef?.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 7)
      }
    })
    // Play rewind sound
    if (rewindSound.current) {
      rewindSound.current.currentTime = 0
      rewindSound.current.play().catch(() => {
        // Ignore play() errors (e.g., if user hasn't interacted with page yet)
      })
    }
  }

  const handlePlayPause = (e) => {
    e.stopPropagation()
    handleButtonClick('playpause', () => {
      if (videoRef?.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
      }
    })
    // Play button click sound
    if (buttonClickSound.current) {
      buttonClickSound.current.currentTime = 0
      buttonClickSound.current.play().catch(() => {
        // Ignore play() errors (e.g., if user hasn't interacted with page yet)
      })
    }
  }

  return (
    <div className={`video-controls ${visible ? 'visible' : ''}`}>
      <button 
        className={`video-control-btn ${activeButton === 'restart' ? 'active' : ''}`}
        onMouseDown={() => handleButtonDown('restart')}
        onMouseUp={() => handleButtonUp('restart', true)}
        onMouseLeave={() => handleButtonUp('restart', false)}
        onTouchStart={() => handleButtonDown('restart')}
        onTouchEnd={() => handleButtonUp('restart', true)}
        onClick={handleRestart}
        aria-label="Restart video"
        style={{ position: 'relative' }}
      >
        <InlineSVG src="/img/ui/restart.svg" alt="Restart" />
        {splashData?.buttonId === 'restart' && splashData.droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="droplet-splash"
            style={{
              '--droplet-x': `${droplet.x}px`,
              '--droplet-y': `${droplet.y}px`,
              '--droplet-start-x': `${droplet.startX}px`,
              '--droplet-start-y': `${droplet.startY}px`
            }}
          >
            <InlineSVG src="/img/ui/droplet.svg" alt="" />
          </div>
        ))}
      </button>
      <button 
        className={`video-control-btn ${activeButton === 'rewind' ? 'active' : ''}`}
        onMouseDown={() => handleButtonDown('rewind')}
        onMouseUp={() => handleButtonUp('rewind', true)}
        onMouseLeave={() => handleButtonUp('rewind', false)}
        onTouchStart={() => handleButtonDown('rewind')}
        onTouchEnd={() => handleButtonUp('rewind', true)}
        onClick={handleRewind}
        aria-label="Rewind 7 seconds"
        style={{ position: 'relative' }}
      >
        <InlineSVG src="/img/ui/rewind.svg" alt="Rewind" />
        {splashData?.buttonId === 'rewind' && splashData.droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="droplet-splash"
            style={{
              '--droplet-x': `${droplet.x}px`,
              '--droplet-y': `${droplet.y}px`,
              '--droplet-start-x': `${droplet.startX}px`,
              '--droplet-start-y': `${droplet.startY}px`
            }}
          >
            <InlineSVG src="/img/ui/droplet.svg" alt="" />
          </div>
        ))}
      </button>
      <button 
        className={`video-control-btn ${activeButton === 'playpause' ? 'active' : ''}`}
        onMouseDown={() => handleButtonDown('playpause')}
        onMouseUp={() => handleButtonUp('playpause', true)}
        onMouseLeave={() => handleButtonUp('playpause', false)}
        onTouchStart={() => handleButtonDown('playpause')}
        onTouchEnd={() => handleButtonUp('playpause', true)}
        onClick={handlePlayPause}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        style={{ position: 'relative' }}
      >
        <InlineSVG 
          src={isPlaying ? '/img/ui/pause.svg' : '/img/ui/play.svg'} 
          alt={isPlaying ? 'Pause' : 'Play'} 
        />
        {splashData?.buttonId === 'playpause' && splashData.droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="droplet-splash"
            style={{
              '--droplet-x': `${droplet.x}px`,
              '--droplet-y': `${droplet.y}px`,
              '--droplet-start-x': `${droplet.startX}px`,
              '--droplet-start-y': `${droplet.startY}px`
            }}
          >
            <InlineSVG src="/img/ui/droplet.svg" alt="" />
          </div>
        ))}
      </button>
    </div>
  )
}

export default VideoControls

