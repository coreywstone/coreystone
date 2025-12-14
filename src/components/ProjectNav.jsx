import { useEffect, useRef, useState } from 'react'
import './ProjectNav.css'

function ProjectNav({ title, sections = [], activeSectionId, onTabClick, scrollContainerRef, isSticky, color = '#F5EFE7', showTabs = true }) {
  const [indicatorStyle, setIndicatorStyle] = useState({
    opacity: 0,
    left: '0px',
    width: '0px',
    height: '0px'
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const tabsRef = useRef([])
  const indicatorRef = useRef(null)
  const navRef = useRef(null)
  const tabsContainerRef = useRef(null)
  const previousActiveId = useRef(null)
  const isInitialMount = useRef(true)

  // Update indicator position when active section changes
  useEffect(() => {
    if (sections.length === 0 || !navRef.current) return

    const currentActiveId = activeSectionId || sections[0]?.id
    if (!currentActiveId) return

    const activeIndex = sections.findIndex(section => section.id === currentActiveId)
    if (activeIndex === -1) return

    const activeTab = tabsRef.current[activeIndex]
    if (!activeTab || !tabsContainerRef.current) return

    const updateIndicatorPosition = () => {
      const tabRect = activeTab.getBoundingClientRect()
      const tabsContainerRect = tabsContainerRef.current.getBoundingClientRect()
      
      // Ensure we have valid dimensions
      if (tabRect.width === 0 || tabRect.height === 0) {
        // Retry if tab isn't ready yet
        setTimeout(() => {
          requestAnimationFrame(updateIndicatorPosition)
        }, 50)
        return
      }
      
      const left = tabRect.left - tabsContainerRect.left
      const width = tabRect.width
      const height = tabRect.height

      // Only animate if this is not the initial mount and the section actually changed
      const shouldAnimate = !isInitialMount.current && previousActiveId.current !== currentActiveId && previousActiveId.current !== null

      if (shouldAnimate) {
        setIsAnimating(true)
        // Reset animation state after animation completes
        setTimeout(() => {
          setIsAnimating(false)
        }, 950) // Match animation duration
      }

      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: 'scale(1, 1)',
        opacity: 1
      })

      previousActiveId.current = currentActiveId
      isInitialMount.current = false
    }

    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(updateIndicatorPosition)
    })
  }, [activeSectionId, sections])

  const handleTabClick = (sectionId, index) => {
    if (onTabClick) {
      onTabClick(sectionId, index)
    }
  }

  return (
    <nav ref={navRef} className={`project-nav ${isSticky ? 'sticky' : ''}`}>
      {title && (
        <h2 className="project-nav-title" style={{ color }}>
          {title === 'Chegg Skills:' ? (
            <img src="/img/chegg/chegg-logo.svg" alt="Chegg Skills" />
          ) : (
            title
          )}
        </h2>
      )}
      {showTabs && sections.length > 0 && (
        <div ref={tabsContainerRef} className="project-nav-tabs">
          <div 
            ref={indicatorRef}
            className={`project-nav-indicator ${isAnimating ? 'animating' : ''}`}
            style={{ ...indicatorStyle, backgroundColor: color }}
          />
          {sections.map((section, index) => (
            <button
              key={section.id}
              ref={el => tabsRef.current[index] = el}
              className={`project-nav-tab ${activeSectionId === section.id ? 'active' : ''}`}
              onClick={() => handleTabClick(section.id, index)}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

export default ProjectNav

