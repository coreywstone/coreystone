import { useEffect, useRef } from 'react'
import './IntroSection.css'

function IntroSection() {
  const canvasRef = useRef(null)

  useEffect(() => {
    // Placeholder for Rive animation
    // When ready, uncomment and configure:
    /*
    if (window.rive && canvasRef.current) {
      new window.rive.Rive({
        src: '/animations/portfolio-intro.riv',
        canvas: canvasRef.current,
        autoplay: true,
      })
    }
    */
  }, [])

  return (
    <section className="intro-section">
      <div className="intro-container">
        <canvas 
          ref={canvasRef} 
          className="intro-animation"
          style={{ display: 'none' }}
        />
        <div className="intro-placeholder">
          <h1 className="intro-title">Corey Stone</h1>
          <p className="intro-subtitle">Lead Product Designer & Strategist</p>
          <p className="intro-note">Rive animation placeholder</p>
        </div>
      </div>
    </section>
  )
}

export default IntroSection

