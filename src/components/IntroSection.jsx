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
          <img 
            src="/img/me/corey-arms-at-side.svg" 
            alt="Corey Stone" 
            className="intro-avatar"
          />
          <h1 className="intro-title">Corey Stone</h1>
          <p className="intro-subtitle">Lead Product Designer & Strategist</p>
          <p className="intro-text">I don't really look like this, because the C on my chest stands for Cookies (and not the browser kind 🍪).</p>
        </div>
      </div>
    </section>
  )
}

export default IntroSection

