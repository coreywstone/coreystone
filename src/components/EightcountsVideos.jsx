import { useRef, useState } from 'react'
import VideoControls from './VideoControls'
import './EightcountsVideos.css'

function EightcountsVideos() {
  const video1Ref = useRef(null)
  const video2Ref = useRef(null)
  const video3Ref = useRef(null)

  const [showControls1, setShowControls1] = useState(false)
  const [showControls2, setShowControls2] = useState(false)
  const [showControls3, setShowControls3] = useState(false)

  const handleVideoClick = (videoRef) => (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('.video-controls')) return

    if (videoRef?.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  return (
    <div className="eightcounts-panel eightcounts-videos-panel">
      {/* Video 1: Big-counts-demo.mov - fills panel height */}
      <div className="eightcounts-video-wrapper">
        <span className="eightcounts-video-label">Animating in Rive.app:</span>
        <div
          className="eightcounts-video-container"
          onMouseEnter={() => setShowControls1(true)}
          onMouseLeave={() => setShowControls1(false)}
          onClick={handleVideoClick(video1Ref)}
        >
          <video
            ref={video1Ref}
            className="eightcounts-video"
            src="/img/8counts/big-counts-demo.mp4"
            muted
            loop
            playsInline
            autoPlay
          />
          <VideoControls videoRef={video1Ref} visible={showControls1} />
        </div>
      </div>

      {/* Video 2: field-saved.mp4 - natural size */}
      <div
        className="eightcounts-video-container eightcounts-video-natural"
        onMouseEnter={() => setShowControls2(true)}
        onMouseLeave={() => setShowControls2(false)}
        onClick={handleVideoClick(video2Ref)}
      >
        <video
          ref={video2Ref}
          className="eightcounts-video"
          src="/img/8counts/field-saved.mp4"
          muted
          loop
          playsInline
          autoPlay
        />
        <VideoControls videoRef={video2Ref} visible={showControls2} />
      </div>

      {/* Video 3: Figma-Make-transition-timing.mov - fills panel height */}
      <div className="eightcounts-video-wrapper">
        <span className="eightcounts-video-label">Playing with transitions in Figma Make:</span>
        <div
          className="eightcounts-video-container"
          onMouseEnter={() => setShowControls3(true)}
          onMouseLeave={() => setShowControls3(false)}
          onClick={handleVideoClick(video3Ref)}
        >
          <video
            ref={video3Ref}
            className="eightcounts-video"
            src="/img/8counts/figma-make-transition-timing.mp4"
            muted
            loop
            playsInline
            autoPlay
          />
          <VideoControls videoRef={video3Ref} visible={showControls3} />
        </div>
      </div>
    </div>
  )
}

export default EightcountsVideos
