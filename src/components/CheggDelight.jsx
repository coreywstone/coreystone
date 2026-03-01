import { useRef, useEffect, useState } from 'react'
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

const PARTY_SPOTLIGHT_COLORS = ['#E6D5F5', '#FFF9C4', '#FFE0B2']

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff }
}

function lerpRgb(hex1, hex2, t) {
  const a = hexToRgb(hex1)
  const b = hexToRgb(hex2)
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t)
  }
}

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
  const panelVideoRef = useRef(null)
  const confettiActiveRef = useRef(false)
  const spotlightCanvasRef = useRef(null)
  const spotlightActiveRef = useRef(false)
  const cursorPosRef = useRef({ x: 0, y: 0 })
  const cursorInPanelRef = useRef(false)
  const spotlightPosRef = useRef({ x: 0, y: 0 })
  const spotlightFrameIdRef = useRef(null)
  const spotlightLoopRef = useRef(null)
  const spotlightRevealRef = useRef(0)
  const spotlightRevealFromRef = useRef(0)
  const spotlightRevealToRef = useRef(0)
  const spotlightRevealStartTimeRef = useRef(0)
  const [phogImage, setPhogImage] = useState('/img/me/phog-lying-on-side.png')

  const SPOTLIGHT_REVEAL_DURATION = 200
  const easeOutQuad = (t) => 1 - (1 - t) ** 2

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
    const panel = scrollDownRef.current
    const video = panelVideoRef.current
    if (!panel || !video) return

    const updatePanelWidth = () => {
      const vw = video.videoWidth
      const vh = video.videoHeight
      if (!vw || !vh) return
      const panelHeight = panel.getBoundingClientRect().height
      if (!panelHeight) return
      panel.style.width = `${Math.round(panelHeight * (vw / vh))}px`
    }

    const onLoadedMetadata = () => updatePanelWidth()
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    if (video.readyState >= 1) updatePanelWidth()

    const ro = new ResizeObserver(updatePanelWidth)
    ro.observe(panel)

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const canvas = spotlightCanvasRef.current
    const panel = scrollDownRef.current
    if (!canvas || !panel) return

    const loop = () => {
      const c = spotlightCanvasRef.current
      const p = scrollDownRef.current
      if (!c || !p) {
        spotlightFrameIdRef.current = requestAnimationFrame(loop)
        return
      }
      const rect = p.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      if (w <= 0 || h <= 0) {
        spotlightFrameIdRef.current = requestAnimationFrame(loop)
        return
      }
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr
        c.height = h * dpr
        c.style.width = `${w}px`
        c.style.height = `${h}px`
      }
      const ctx = c.getContext('2d', { alpha: true })
      if (!ctx) {
        spotlightFrameIdRef.current = requestAnimationFrame(loop)
        return
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, w, h)
      /* Dark overlay always visible; hole/tint only when panel in view and cursor in panel */
      ctx.globalAlpha = 0.8
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1

      if (!spotlightActiveRef.current) {
        spotlightFrameIdRef.current = requestAnimationFrame(loop)
        return
      }
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const showSpotlight = cursorInPanelRef.current && !reduceMotion

      const cursor = cursorPosRef.current
      const spot = spotlightPosRef.current
      spot.x += (cursor.x - spot.x) * 0.12
      spot.y += (cursor.y - spot.y) * 0.12

      /* Update reveal (0→1 on enter, 1→0 on leave) with 200ms ease-out */
      const now = Date.now()
      const from = spotlightRevealFromRef.current
      const to = spotlightRevealToRef.current
      const startTime = spotlightRevealStartTimeRef.current
      const elapsed = now - startTime
      const progress = Math.min(elapsed / SPOTLIGHT_REVEAL_DURATION, 1)
      spotlightRevealRef.current = from + (to - from) * easeOutQuad(progress)

      const reveal = spotlightRevealRef.current
      if (reveal > 0.001) {
        const cx = spot.x
        const cy = spot.y
        const rInner = 75 * reveal
        const rOuter = 188 * reveal
        const grad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter)
        grad.addColorStop(0, 'rgba(255,255,255,1)')
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.globalCompositeOperation = 'destination-out'
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'

        const phase = (Date.now() / 2500) % 1
        const seg = phase * 3
        const i = Math.floor(seg) % 3
        const j = (i + 1) % 3
        const t = seg - Math.floor(seg)
        const rgb = lerpRgb(PARTY_SPOTLIGHT_COLORS[i], PARTY_SPOTLIGHT_COLORS[j], t)
        const rClear = 36 * 1.3 * reveal
        const rTintFeather = 110 * reveal
        const rTintStart = rClear + rTintFeather
        const tintGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rOuter)
        tintGrad.addColorStop(0, 'rgba(255,255,255,0)')
        tintGrad.addColorStop(rClear / rOuter, 'rgba(255,255,255,0)')
        tintGrad.addColorStop(rTintStart / rOuter, `rgba(${rgb.r},${rgb.g},${rgb.b},0.45)`)
        tintGrad.addColorStop(0.7, `rgba(${rgb.r},${rgb.g},${rgb.b},0.2)`)
        tintGrad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = tintGrad
        ctx.fillRect(0, 0, w, h)
      }

      spotlightFrameIdRef.current = requestAnimationFrame(loop)
    }
    spotlightLoopRef.current = loop
    /* Start loop so dark overlay is always visible, even when panel not in view */
    if (!spotlightFrameIdRef.current) {
      spotlightFrameIdRef.current = requestAnimationFrame(loop)
    }

    return () => {
      spotlightLoopRef.current = null
      if (spotlightFrameIdRef.current) {
        cancelAnimationFrame(spotlightFrameIdRef.current)
        spotlightFrameIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const panel = scrollDownRef.current
    if (!panel) return

    const onMouseMove = (e) => {
      const rect = panel.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        cursorPosRef.current = { x, y }
        if (!cursorInPanelRef.current) {
          cursorInPanelRef.current = true
          spotlightPosRef.current = { x, y }
          const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
          spotlightRevealFromRef.current = spotlightRevealRef.current
          spotlightRevealToRef.current = reduceMotion ? 0 : 1
          spotlightRevealStartTimeRef.current = Date.now()
        }
      }
    }
    const onMouseLeave = () => {
      cursorInPanelRef.current = false
      spotlightRevealFromRef.current = spotlightRevealRef.current
      spotlightRevealToRef.current = 0
      spotlightRevealStartTimeRef.current = Date.now()
    }

    panel.addEventListener('mousemove', onMouseMove, { passive: true })
    panel.addEventListener('mouseleave', onMouseLeave)
    return () => {
      panel.removeEventListener('mousemove', onMouseMove)
      panel.removeEventListener('mouseleave', onMouseLeave)
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
          const v = panelVideoRef.current
          if (v) {
            v.playbackRate = 0.7
            v.play().catch(() => {})
          }
          spotlightActiveRef.current = true
          if (spotlightLoopRef.current && !spotlightFrameIdRef.current) {
            spotlightFrameIdRef.current = requestAnimationFrame(spotlightLoopRef.current)
          }
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
          panelVideoRef.current?.pause()
          confettiActiveRef.current = false
          spotlightActiveRef.current = false
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
        <div className="chegg-delight-lofi-inner">
          <div className="chegg-delight-lofi-left">
            <p className="chegg-delight-lofi-text">
              To further help learners, I proposed <span className="chegg-delight-nowrap">lo-fi</span> study music and a &apos;Today&apos; micro-display:
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
      </div>

      {/* Panel 6: Party / Scroll down */}
      <div ref={scrollDownRef} className="chegg-delight-scroll-down">
        <video
          ref={panelVideoRef}
          className="chegg-delight-scroll-down-video"
          src="/img/chegg/chegg-dance-party.mp4"
          loop
          muted
          playsInline
          aria-hidden
        />
        <canvas
          ref={spotlightCanvasRef}
          className="chegg-delight-scroll-down-spotlight"
          aria-hidden
        />
        <canvas
          ref={panelCanvasRef}
          className="chegg-delight-scroll-down-canvas"
        />
        <div className="chegg-delight-scroll-down-content">
          <img
            className="chegg-delight-scroll-down-img"
            src="/img/me/me-scroll-down.svg"
            alt=""
          />
        </div>
        <div className="chegg-delight-scroll-down-phog">
          <img
            src={phogImage}
            alt="Phog the cat"
            className="chegg-delight-scroll-down-phog-img"
            onClick={() => {
              const audio = new Audio('/img/me/phog-meow.mp3')
              audio.play().catch(() => {})
              setPhogImage('/img/me/phog-lying-on-side-poked.png')
              setTimeout(() => setPhogImage('/img/me/phog-lying-on-side.png'), 500)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default CheggDelight
