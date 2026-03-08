import { useEffect, useRef, useState } from 'react'
import './LearningPanel.css'

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
  { id: 'how-i-ai', src: '/img/podcasts/how-i-ai.webp', alt: 'How I AI', url: 'https://www.lennysnewsletter.com/s/how-i-ai', baseZ: 3, description: 'How I AI shows practical AI usage with Claire Vo.', name: 'How I AI', backBg: '#5e35b1' },
  { id: 'the-panel', src: '/img/podcasts/the-panel.webp', alt: 'The Panel', url: 'https://panelpodcast.com/', baseZ: 4, description: 'The Panel is 3 startup founders talking modern processes.', name: 'The Panel', backBg: '#00EEAC', backText: 'dark' }
]

const Z_INDEX_FRONT = 10

function LearningPanel() {
  const containerRef = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(null)
  const [nextOpacity, setNextOpacity] = useState(0)
  const [hoveredId, setHoveredId] = useState(null)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const rafRef = useRef(null)
  const activeIndexRef = useRef(activeIndex)
  activeIndexRef.current = activeIndex

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

      {/* Podcast cards: left column (0–2), right column (3–5), 32px from edges, space-evenly */}
      <div className="learning-panel-cards-left">
        {PODCAST_CARDS.slice(0, 3).map((card, i) => {
          const parts = card.description.split(card.name)
          return (
            <a
              key={card.id}
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
                    {parts[1]}
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
                    {parts[1]}
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
