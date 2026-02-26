import { useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import './CheggDelight.css'

const CHEGG_ORANGES_YELLOWS = [
  '#D65F00',
  '#EB7100',
  '#E87A1A',
  '#FF8C42',
  '#FFA366',
  '#FFC496',
  '#FFD54F',
  '#FFEB3B',
  '#FFF176'
]

function runPanelConfettiRain(instance, isActiveRef) {
  if (!instance) return

  const baseOptions = {
    particleCount: 150,
    spread: 120,
    startVelocity: 45,
    gravity: 1.1,
    decay: 0.9,
    ticks: 450,
    colors: CHEGG_ORANGES_YELLOWS
  }

  const bursts = 10
  for (let i = 0; i < bursts; i++) {
    const delay = i * 180
    window.setTimeout(() => {
      if (!isActiveRef.current) return
      const originX = Math.random()
      instance({
        ...baseOptions,
        origin: { x: originX, y: 0.05 },
        particleCount:
          baseOptions.particleCount + Math.round(Math.random() * 40),
        scalar: 0.9 + Math.random() * 0.3
      })
    }, delay)
  }
}

function startPanelConfettiLoop(panelConfettiRef, isActiveRef) {
  const loop = () => {
    const instance = panelConfettiRef.current
    if (!isActiveRef.current || !instance) return

    runPanelConfettiRain(instance, isActiveRef)

    const nextDelay = 2600 + Math.random() * 1200
    window.setTimeout(loop, nextDelay)
  }

  loop()
}

function CheggDelight() {
  const scrollDownRef = useRef(null)
  const panelCanvasRef = useRef(null)
  const panelConfettiRef = useRef(null)
  const confettiActiveRef = useRef(false)

  useEffect(() => {
    const canvas = panelCanvasRef.current
    if (!canvas) return

    const instance = confetti.create(canvas, {
      resize: true,
      useWorker: true,
      disableForReducedMotion: true
    })
    panelConfettiRef.current = instance

    return () => {
      panelConfettiRef.current = null
    }
  }, [])

  useEffect(() => {
    const el = scrollDownRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry) return
        const isVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.25

        if (isVisible) {
          if (!confettiActiveRef.current && panelConfettiRef.current) {
            const reduceMotion =
              typeof window !== 'undefined' &&
              window.matchMedia &&
              window.matchMedia('(prefers-reduced-motion: reduce)').matches

            if (reduceMotion) return

            confettiActiveRef.current = true
            startPanelConfettiLoop(panelConfettiRef, confettiActiveRef)
          }
        } else {
          confettiActiveRef.current = false
        }
      },
      { threshold: [0, 0.25, 0.5, 1], rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="chegg-delight-panel">
      {/* Panel 1: Problem */}
      <div className="chegg-delight-problem">
        <img src="/img/chegg/chegg-delight-problem.jpg" alt="Delight problem" />
      </div>

      {/* Panel 2: Thinking */}
      <div className="chegg-delight-thinking">
        <img src="/img/chegg/chegg-delight-thinking.jpg" alt="Delight thinking" />
      </div>

      {/* Panel 3: Presentation */}
      <div className="chegg-delight-presentation">
        <img
          className="chegg-delight-me"
          src="/img/me/me-presenting-to-right.svg"
          alt=""
        />
        <div className="chegg-delight-dashboards-container">
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              Iterating on journey-based dashboards:
            </h3>
            <div className="chegg-delight-dashboard-wrapper chegg-delight-dashboard-wrapper--iterations">
              <img
                className="chegg-delight-dashboard chegg-delight-dashboard--iterations"
                src="/img/chegg/chegg-dashboard-iterations.png"
                alt="Dashboard iterations"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              My new hyper-personalized coach-focused dashboard:
            </h3>
            <div className="chegg-delight-dashboard-wrapper">
              <img
                className="chegg-delight-dashboard"
                src="/img/chegg/chegg-dashboard-light.png"
                alt="Chegg dashboard"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack chegg-delight-dashboard-stack--figma-make">
            <h3 className="chegg-delight-dashboard-title">
              Figma 'Make' for RAG prompt testing:
            </h3>
            <div className="chegg-delight-dashboard-wrapper chegg-delight-dashboard-wrapper--figma-make">
              <img
                className="chegg-delight-dashboard chegg-delight-dashboard--figma-make"
                src="/img/chegg/chegg-delight-figma-make.png"
                alt="Figma Make RAG simulation"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              For the ikea effect, dark mode & unsplash options:
            </h3>
            <div className="chegg-delight-dashboard-wrapper">
              <img
                className="chegg-delight-dashboard"
                src="/img/chegg/chegg-dashboard-dark.jpg"
                alt="Chegg dashboard dark mode"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack chegg-delight-dashboard-stack--dark-theme">
            <h3 className="chegg-delight-dashboard-title">
              Dark variables with Anthony & dev Katie:
            </h3>
            <div className="chegg-delight-dashboard-wrapper chegg-delight-dashboard-wrapper--dark-theme">
              <img
                className="chegg-delight-dashboard chegg-delight-dashboard--dark-theme"
                src="/img/chegg/chegg-delight-dark-theme.png"
                alt="Dark theme variables"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel 4: Confetti */}
      <div className="chegg-delight-confetti">
        <iframe
          src="/files/confetti.html"
          title="Confetti animation"
          className="chegg-delight-confetti-iframe"
        />
      </div>

      {/* Panel 5: Lo-fi */}
      <div className="chegg-delight-lofi">
        <div className="chegg-delight-lofi-left">
          <p className="chegg-delight-lofi-text">
            To further help learners, I proposed <span className="chegg-delight-nowrap">lo-fi</span> study music and a &apos;Today&apos; micro-display.
          </p>
        </div>
        <div className="chegg-delight-lofi-right">
          <img
            className="chegg-delight-lofi-img"
            src="/img/chegg/chegg-delight-lo-fi.png"
            alt="Lo-fi study music and Today micro-display"
          />
        </div>
      </div>

      {/* Panel 6: Scroll down */}
      <div ref={scrollDownRef} className="chegg-delight-scroll-down">
        <canvas
          ref={panelCanvasRef}
          className="chegg-delight-scroll-down-canvas"
        />
        <div className="chegg-delight-scroll-down-content">
          <h3 className="chegg-delight-scroll-down-title">That&apos;s it – scroll down!</h3>
          <img
            className="chegg-delight-scroll-down-img"
            src="/img/me/me-scroll-down.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default CheggDelight
