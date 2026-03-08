import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './LearningPanel.css'

const WAVE_AMPLITUDE_START = 70
const WAVE_AMPLITUDE_END = 20
const WAVE_OSCILLATIONS = 4
const WAVE_SAMPLES = 60
const WAVE_PERPENDICULAR_OFFSETS = [-6, 0, 6] // 3 offset strands
const WAVE_FADE_START_PX = 45
const WAVE_FADE_END_PX = 72
const WAVE_MASK_FADE_PX = 48 // soft mask from 72px (black) to 72+48 (white) for gradual disappear
const WAVE_PATH_LENGTH = 100 // for consistent animation
const PARTICLE_COUNT_PER_CARD = 12
const PARTICLE_STAGGER_S = 0.2

// Carousel order: 1 walking, 2 mowing, 3 driving, 4 rowing
const LEARNING_IMAGES = ['walking', 'mowing', 'driving', 'rowing']
const DISPLAY_MS = 4000
const CROSSFADE_DURATION_MS = 1500
const CYCLE_MS = DISPLAY_MS + CROSSFADE_DURATION_MS

const PODCAST_CARDS = [
  { id: 'dive-club', src: '/img/podcasts/dive-club.webp', alt: 'Dive Club', url: 'https://www.dive.club/', baseZ: 2, description: "Ridd's Dive Club is 'where designers never stop learning' – inspiring stuff!", name: "Ridd's Dive Club", backBg: '#142C2F' },
  { id: 'lenny', src: '/img/podcasts/lenny.webp', alt: "Lenny's Podcast", url: 'https://www.lennysnewsletter.com/podcast', baseZ: 6, description: "Lenny interviews the best product people in the world – it's gold, Jerry, gold!", name: 'Lenny', backBg: '#FCD3B6', backText: 'dark' },
  { id: 'founders', src: '/img/podcasts/founders.webp', alt: 'Founders', url: 'https://www.founderspodcast.com/', baseZ: 1, description: 'Founders takes deep dives into how the best founders think.', name: 'Founders', backBg: '#0a0a0a' },
  { id: 'nn', src: '/img/podcasts/nn.webp', alt: 'The NN/g UX Podcast', url: 'https://creators.spotify.com/pod/profile/nngroup/', baseZ: 5, description: 'Nielsen-Norman provides research-based real-world insights.', name: 'Nielsen-Norman', backBg: '#b71c1c' },
  { id: 'how-i-ai', src: '/img/podcasts/how-i-ai.webp', alt: 'How I AI', url: 'https://www.lennysnewsletter.com/s/how-i-ai', baseZ: 3, description: 'How I AI shows practical AI usage with Claire Vo.', name: 'How I AI', backBg: '#5e35b1', noWrapInDescription: 'Claire Vo' },
  { id: 'the-panel', src: '/img/podcasts/the-panel.webp', alt: 'The Panel', url: 'https://panelpodcast.com/', baseZ: 4, description: 'The Panel is 3 bootstrappers discussing modern product and process.', name: 'The Panel', backBg: '#00EEAC', backText: 'dark' }
]

const Z_INDEX_FRONT = 10

/** Build sinusoidal path from (sx,sy) to (tx,ty) with amplitude tapering 70px→20px. Optional perpendicular offset in px. Returns { d, length }. */
function buildWavePath(sx, sy, tx, ty, perpendicularOffset = 0) {
  const dx = tx - sx
  const dy = ty - sy
  const L = Math.hypot(dx, dy)
  if (L < 1) return { d: `M ${sx} ${sy}`, length: 0 }
  const ux = dx / L
  const uy = dy / L
  const perpX = -uy
  const perpY = ux
  const points = []
  let length = 0
  for (let i = 0; i <= WAVE_SAMPLES; i++) {
    const t = i / WAVE_SAMPLES
    const A = WAVE_AMPLITUDE_START * (1 - t) + WAVE_AMPLITUDE_END * t
    const wobble = A * Math.sin(t * Math.PI * 2 * WAVE_OSCILLATIONS)
    const x = sx + dx * t + perpX * (wobble + perpendicularOffset)
    const y = sy + dy * t + perpY * (wobble + perpendicularOffset)
    points.push([x, y])
    if (i > 0) {
      const [px, py] = points[i - 1]
      length += Math.hypot(x - px, y - py)
    }
  }
  const d = points.reduce((acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`), '')
  return { d, length }
}

/** Closed path between two strands (top and bottom offset) for ribbon fill. Same sine formula as buildWavePath. */
function buildWaveRibbonPath(sx, sy, tx, ty, offsetTop, offsetBottom) {
  const dx = tx - sx
  const dy = ty - sy
  const L = Math.hypot(dx, dy)
  if (L < 1) return { d: `M ${sx} ${sy} Z`, length: 0 }
  const perpX = -dy / L
  const perpY = dx / L
  const topPoints = []
  const bottomPoints = []
  for (let i = 0; i <= WAVE_SAMPLES; i++) {
    const t = i / WAVE_SAMPLES
    const A = WAVE_AMPLITUDE_START * (1 - t) + WAVE_AMPLITUDE_END * t
    const wobble = A * Math.sin(t * Math.PI * 2 * WAVE_OSCILLATIONS)
    topPoints.push([sx + dx * t + perpX * (wobble + offsetTop), sy + dy * t + perpY * (wobble + offsetTop)])
    bottomPoints.push([sx + dx * t + perpX * (wobble + offsetBottom), sy + dy * t + perpY * (wobble + offsetBottom)])
  }
  const topD = topPoints.reduce((acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`), '')
  const [bx, by] = bottomPoints[bottomPoints.length - 1]
  const bottomBack = bottomPoints.slice(0, -1).reverse().reduce((acc, [x, y]) => `${acc} L ${x} ${y}`, '')
  const d = `${topD} L ${bx} ${by} ${bottomBack} Z`
  return { d }
}

function LearningPanel() {
  const containerRef = useRef(null)
  const cardRefs = useRef({})
  const [isInView, setIsInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [nextOpacity, setNextOpacity] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const [waveLayout, setWaveLayout] = useState(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const rafRef = useRef(null)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

  useLayoutEffect(() => {
    if (!isInView || !containerRef.current) {
      setWaveLayout(null)
      return
    }
    const panel = containerRef.current
    const updateLayout = () => {
      const rect = panel.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const targetX = width * 0.5
      const targetY = height * 0.2
      const cards = []
      for (const card of PODCAST_CARDS) {
        const el = cardRefs.current[card.id]
        if (!el) continue
        const cr = el.getBoundingClientRect()
        const cx = cr.left - rect.left + cr.width / 2
        const cy = cr.top - rect.top + cr.height / 2
        cards.push({ id: card.id, cx, cy })
      }
      setWaveLayout({ width, height, target: { x: targetX, y: targetY }, cards })
    }
    const rafId = requestAnimationFrame(updateLayout)
    const ro = new ResizeObserver(updateLayout)
    ro.observe(panel)
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [isInView])

  // IntersectionObserver: only run when panel is in view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Start crossfade: next slide goes from opacity 0 → 1 (needs one frame at 0 so transition runs)
  useEffect(() => {
    if (nextIndex === null) return
    rafRef.current = requestAnimationFrame(() => setNextOpacity(1))
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [nextIndex])

  // Carousel: show slide for 4s, then 1500ms cross-dissolve to next; smooth loop 4→1
  useEffect(() => {
    if (!isInView) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      const current = activeIndexRef.current
      const next = (current + 1) % LEARNING_IMAGES.length
      setNextIndex(next)
      setNextOpacity(0)

      timeoutRef.current = setTimeout(() => {
        setActiveIndex(next)
        setNextIndex(null)
        setNextOpacity(0)
        timeoutRef.current = null
      }, CROSSFADE_DURATION_MS)
    }, CYCLE_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [isInView])

  return (
    <div
      ref={containerRef}
      className={`learning-panel ${isInView ? 'learning-panel--in-view' : ''}`}
    >
      {/* Image carousel: 4 slides, cross-dissolve between them */}
      <div className="learning-panel-carousel">
        {LEARNING_IMAGES.map((name, i) => (
          <div
            key={name}
            className="learning-panel-slide"
            style={{
              backgroundImage: `url(/img/learning/${name}.jpg)`,
              opacity: i === activeIndex ? 1 : i === nextIndex ? nextOpacity : 0,
              zIndex: i === nextIndex ? 2 : i === activeIndex ? 1 : 0,
              transition: i === nextIndex ? `opacity ${CROSSFADE_DURATION_MS}ms ease-in-out` : 'none'
            }}
            aria-hidden={i !== activeIndex && i !== nextIndex}
          />
        ))}
      </div>

      {/* Sound waves: from each card center toward (50%, 20%), 3 waves per card */}
      {isInView && waveLayout && waveLayout.cards.length > 0 && (
        <div className="learning-panel-waves" aria-hidden="true">
          <svg
            className="learning-panel-waves-svg"
            viewBox={`0 0 ${waveLayout.width} ${waveLayout.height}`}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <defs>
              {/* 72px dead zone: nothing visible inside; soft fade from 72px to 72+WAVE_MASK_FADE_PX */}
              <radialGradient
                id="learning-wave-mask-radial"
                gradientUnits="userSpaceOnUse"
                cx={waveLayout.target.x}
                cy={waveLayout.target.y}
                r={72 + WAVE_MASK_FADE_PX}
              >
                <stop offset="0" stopColor="black" />
                <stop offset={72 / (72 + WAVE_MASK_FADE_PX)} stopColor="black" />
                <stop offset="1" stopColor="white" />
              </radialGradient>
              <mask id="learning-wave-mask">
                <rect x={0} y={0} width={waveLayout.width} height={waveLayout.height} fill="white" />
                <circle
                  cx={waveLayout.target.x}
                  cy={waveLayout.target.y}
                  r={72 + WAVE_MASK_FADE_PX}
                  fill="url(#learning-wave-mask-radial)"
                />
              </mask>
              {/* Glow: soft blur behind strokes for luminous ribbon look */}
              <filter id="learning-wave-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 1 1 0 0  0 1 1 0 0  0 0 0 0.4 0" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {waveLayout.cards.map((card) => {
                const centerPathLen = buildWavePath(card.cx, card.cy, waveLayout.target.x, waveLayout.target.y, 0).length
                const fadeOutStartPx = WAVE_FADE_END_PX + WAVE_MASK_FADE_PX
                const ribbonFadeStart = centerPathLen > fadeOutStartPx
                  ? ((centerPathLen - fadeOutStartPx) / centerPathLen) * 100
                  : 100
                const ribbonFadeEnd = centerPathLen > WAVE_FADE_END_PX
                  ? ((centerPathLen - WAVE_FADE_END_PX) / centerPathLen) * 100
                  : 100
                return (
                  <linearGradient
                    key={`ribbon-${card.id}`}
                    id={`ribbonGrad-${card.id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={card.cx}
                    y1={card.cy}
                    x2={waveLayout.target.x}
                    y2={waveLayout.target.y}
                  >
                    <stop offset="0%" stopColor="rgba(0,210,255,0.08)" />
                    <stop offset={`${ribbonFadeStart}%`} stopColor="rgba(255,255,255,0.06)" />
                    <stop offset={`${ribbonFadeEnd}%`} stopColor="rgba(255,255,255,0)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                )
              })}
              {waveLayout.cards.flatMap((card) =>
                WAVE_PERPENDICULAR_OFFSETS.map((offset, wi) => {
                  const pathInfo = buildWavePath(
                    card.cx,
                    card.cy,
                    waveLayout.target.x,
                    waveLayout.target.y,
                    offset
                  )
                  const fadeInStop = pathInfo.length > 0
                    ? (WAVE_FADE_START_PX / pathInfo.length) * 100
                    : 100
                  const fadeOutStartPx = WAVE_FADE_END_PX + WAVE_MASK_FADE_PX
                  const fadeStop = pathInfo.length > fadeOutStartPx
                    ? ((pathInfo.length - fadeOutStartPx) / pathInfo.length) * 100
                    : 0
                  const fadeStopEnd = pathInfo.length > WAVE_FADE_END_PX
                    ? ((pathInfo.length - WAVE_FADE_END_PX) / pathInfo.length) * 100
                    : 0
                  const gradId = `waveGrad-${card.id}-${wi}`
                  const centerIndex = (WAVE_PERPENDICULAR_OFFSETS.length - 1) / 2
                  const isCenter = wi === centerIndex
                  const colorOpaque = isCenter ? 'rgba(220,255,255,0.85)' : 'rgba(0,220,255,0.7)'
                  const colorTransparent = isCenter ? 'rgba(220,255,255,0)' : 'rgba(0,220,255,0)'
                  return (
                    <linearGradient
                      key={gradId}
                      id={gradId}
                      gradientUnits="userSpaceOnUse"
                      x1={card.cx}
                      y1={card.cy}
                      x2={waveLayout.target.x}
                      y2={waveLayout.target.y}
                    >
                      <stop offset="0%" stopColor={colorTransparent} />
                      <stop offset={`${Math.min(fadeInStop, 100)}%`} stopColor={colorOpaque} />
                      <stop offset={`${fadeStop}%`} stopColor={colorOpaque} />
                      <stop offset={`${fadeStopEnd}%`} stopColor={colorTransparent} />
                      <stop offset="100%" stopColor={colorTransparent} />
                    </linearGradient>
                  )
                })
              )}
            </defs>
            <g mask="url(#learning-wave-mask)" filter="url(#learning-wave-glow)">
              {waveLayout.cards.map((card) => {
                const ribbon = buildWaveRibbonPath(card.cx, card.cy, waveLayout.target.x, waveLayout.target.y, 6, -6)
                return (
                  <path
                    key={`ribbon-${card.id}`}
                    d={ribbon.d}
                    fill={`url(#ribbonGrad-${card.id})`}
                  />
                )
              })}
              {waveLayout.cards.flatMap((card) =>
                WAVE_PERPENDICULAR_OFFSETS.map((offset, wi) => {
                  const pathInfo = buildWavePath(
                    card.cx,
                    card.cy,
                    waveLayout.target.x,
                    waveLayout.target.y,
                    offset
                  )
                  const gradId = `waveGrad-${card.id}-${wi}`
                  const centerIndex = (WAVE_PERPENDICULAR_OFFSETS.length - 1) / 2
                  const strokeWidth = wi === centerIndex ? 3.2 : 2
                  return (
                    <path
                      key={`${card.id}-${wi}`}
                      className={`learning-wave learning-wave--card-${card.id} learning-wave--wave-${wi}`}
                      d={pathInfo.d}
                      fill="none"
                      stroke={`url(#${gradId})`}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      pathLength={WAVE_PATH_LENGTH}
                      strokeDasharray={`${WAVE_PATH_LENGTH * 0.12} ${WAVE_PATH_LENGTH * 0.88}`}
                    />
                  )
                })
              )}
              {/* Particles: stream along center path per card, staggered */}
              {waveLayout.cards.flatMap((card) => {
                const centerPath = buildWavePath(
                  card.cx,
                  card.cy,
                  waveLayout.target.x,
                  waveLayout.target.y,
                  0
                )
                const particleDur = '2.5s'
                return Array.from({ length: PARTICLE_COUNT_PER_CARD }, (_, i) => (
                  <circle
                    key={`particle-${card.id}-${i}`}
                    className={`learning-particle learning-particle--card-${card.id}`}
                    r={2.5}
                    fill="rgba(220,255,255,0.75)"
                  >
                    <animateMotion
                      path={centerPath.d}
                      dur={particleDur}
                      repeatCount="indefinite"
                      begin={`-${i * PARTICLE_STAGGER_S}s`}
                    />
                  </circle>
                ))
              })}
            </g>
          </svg>
        </div>
      )}

      {/* Podcast cards: left column (0–2), right column (3–5), 32px from edges, space-evenly */}
      <div className="learning-panel-cards-left">
        {PODCAST_CARDS.slice(0, 3).map((card, i) => {
          const parts = card.description.split(card.name)
          return (
            <a
              key={card.id}
              ref={(el) => { cardRefs.current[card.id] = el }}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`learning-podcast-card ${hoveredId === card.id ? 'learning-podcast-card--hovered' : ''}`}
              style={{
                zIndex: hoveredId === card.id ? Z_INDEX_FRONT : card.baseZ,
                animationDelay: `${i * 0.15}s`
              }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Open ${card.alt} podcast`}
            >
              <div className="learning-podcast-card-inner">
                <div className="learning-podcast-card-face learning-podcast-card-front">
                  <img
                    src={card.src}
                    alt=""
                    className="learning-podcast-card-image"
                    loading="lazy"
                  />
                </div>
                <div
                  className={`learning-podcast-card-face learning-podcast-card-back${card.backText === 'dark' ? ' learning-podcast-card-back--dark-text' : ''}`}
                  style={{ backgroundColor: card.backBg }}
                >
                  <p className="learning-podcast-card-description">
                    {parts[0]}
                    <span className="learning-podcast-card-name">{card.name}</span>
                    {card.noWrapInDescription && parts[1].includes(card.noWrapInDescription)
                      ? (() => {
                          const i = parts[1].indexOf(card.noWrapInDescription)
                          return <>{parts[1].slice(0, i)}<span style={{ whiteSpace: 'nowrap' }}>{card.noWrapInDescription}</span>{parts[1].slice(i + card.noWrapInDescription.length)}</>
                        })()
                      : parts[1]}
                  </p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
      <div className="learning-panel-cards-right">
        {PODCAST_CARDS.slice(3, 6).map((card, i) => {
          const parts = card.description.split(card.name)
          return (
            <a
              key={card.id}
              ref={(el) => { cardRefs.current[card.id] = el }}
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`learning-podcast-card ${hoveredId === card.id ? 'learning-podcast-card--hovered' : ''}`}
              style={{
                zIndex: hoveredId === card.id ? Z_INDEX_FRONT : card.baseZ,
                animationDelay: `${(i + 3) * 0.15}s`
              }}
              onMouseEnter={() => setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Open ${card.alt} podcast`}
            >
              <div className="learning-podcast-card-inner">
                <div className="learning-podcast-card-face learning-podcast-card-front">
                  <img
                    src={card.src}
                    alt=""
                    className="learning-podcast-card-image"
                    loading="lazy"
                  />
                </div>
                <div
                  className={`learning-podcast-card-face learning-podcast-card-back${card.backText === 'dark' ? ' learning-podcast-card-back--dark-text' : ''}`}
                  style={{ backgroundColor: card.backBg }}
                >
                  <p className="learning-podcast-card-description">
                    {parts[0]}
                    <span className="learning-podcast-card-name">{card.name}</span>
                    {card.noWrapInDescription && parts[1].includes(card.noWrapInDescription)
                      ? (() => {
                          const i = parts[1].indexOf(card.noWrapInDescription)
                          return <>{parts[1].slice(0, i)}<span style={{ whiteSpace: 'nowrap' }}>{card.noWrapInDescription}</span>{parts[1].slice(i + card.noWrapInDescription.length)}</>
                        })()
                      : parts[1]}
                  </p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default LearningPanel
