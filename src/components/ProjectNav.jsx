import { useEffect, useMemo, useRef, useState } from 'react'
import './ProjectNav.css'

function ProjectNav({ title, sections = [], activeSectionId, onTabClick, scrollContainerRef, isSticky, color = '#F5EFE7', showTabs = true, hiddenTabIds = [], scrollProgress = 0 }) {
  const visibleSections = useMemo(() => sections.filter(s => !hiddenTabIds.includes(s.id)), [sections, hiddenTabIds])
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
    if (visibleSections.length === 0 || !navRef.current) return

    const currentActiveId = activeSectionId || sections[0]?.id
    if (!currentActiveId) return

    const activeVisibleIndex = visibleSections.findIndex(s => s.id === currentActiveId)
    if (activeVisibleIndex === -1) {
      setIndicatorStyle(prev => prev.opacity === 0 ? prev : { ...prev, opacity: 0 })
      return
    }

    const activeTab = tabsRef.current[activeVisibleIndex]
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
  }, [activeSectionId])

  const handleTabClick = (sectionId, index) => {
    if (onTabClick) {
      onTabClick(sectionId, index)
    }
  }

  const handleTitleClick = () => {
    if (sections.length > 0 && scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      onTabClick?.(sections[0].id, 0)
    }
  }

  return (
    <nav ref={navRef} className={`project-nav ${isSticky ? 'sticky' : ''}`}>
      {title && (
        <h2
          className={`project-nav-title ${sections.length > 0 ? 'project-nav-title-clickable' : ''}`.trim()}
          style={{ color }}
          onClick={sections.length > 0 ? handleTitleClick : undefined}
          role={sections.length > 0 ? 'button' : undefined}
          tabIndex={sections.length > 0 ? 0 : undefined}
        >
          {title === 'Chegg Skills:' ? (
            <img src="/img/chegg/chegg-logo.svg" alt="Chegg Skills" loading="lazy" />
          ) : (
            title
          )}
        </h2>
      )}
      {showTabs && visibleSections.length > 0 && (
        <div ref={tabsContainerRef} className="project-nav-tabs">
          <div 
            ref={indicatorRef}
            className={`project-nav-indicator ${isAnimating ? 'animating' : ''}`}
            style={{ ...indicatorStyle, backgroundColor: 'var(--color-cream)' }}
          />
          {indicatorStyle.width !== '0px' && (
            <div
              className={`project-nav-progress-fill ${scrollProgress >= 1 ? 'project-nav-progress-fill--full' : ''}`}
              style={{
                left: indicatorStyle.left,
                width: `${parseFloat(indicatorStyle.width) * scrollProgress}px`,
                height: indicatorStyle.height,
                top: '0'
              }}
            />
          )}
          {visibleSections.map((section, visibleIndex) => (
            <button
              key={section.id}
              ref={el => tabsRef.current[visibleIndex] = el}
              className={`project-nav-tab ${activeSectionId === section.id ? 'active' : ''}`}
              onClick={() => handleTabClick(section.id, sections.findIndex(s => s.id === section.id))}
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

