import { useState, useEffect } from 'react'
import InlineSVG from './InlineSVG'
import './VideoControls.css'

function VideoControls({ videoRef, visible = false }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [activeButton, setActiveButton] = useState(null)
  const [splashData, setSplashData] = useState(null) // { buttonId, droplets: [{ id, x, y }] }

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

  const handleRestart = (e) => {
    e.stopPropagation()
    handleButtonClick('restart', () => {
      if (videoRef?.current) {
        videoRef.current.currentTime = 0
      }
    })
  }

  const handleRewind = (e) => {
    e.stopPropagation()
    handleButtonClick('rewind', () => {
      if (videoRef?.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 7)
      }
    })
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

