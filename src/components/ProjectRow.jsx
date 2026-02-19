import { useEffect, useRef, useState } from 'react'
import ProjectNav from './ProjectNav'
import ProjectSection from './ProjectSection'
import './ProjectRow.css'

function ProjectRow({ title, sections = [], color = '#F5EFE7', showNavTabs = true, backgroundColor = null, backstoryBgColor = null, className = '', hiddenTabIds = [] }) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollContainerRef = useRef(null)
  const sectionRefs = useRef([])
  const rowRef = useRef(null)

  // Set up IntersectionObserver to detect when ProjectRow is in view (for sticky nav)
  useEffect(() => {
    if (!rowRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsNavSticky(entry.isIntersecting)
        })
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    )

    observer.observe(rowRef.current)

    return () => {
      if (rowRef.current) {
        observer.unobserve(rowRef.current)
      }
    }
  }, [])

  // Set up IntersectionObserver to detect which section is in view
  useEffect(() => {
    if (sections.length === 0 || !scrollContainerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSectionId(entry.target.id)
          }
        })
      },
      {
        root: scrollContainerRef.current,
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '0px'
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [sections])

  // Update scroll progress when active section changes
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!activeSectionId || !container) {
      setScrollProgress(0)
      return
    }

    const activeSectionIndex = sections.findIndex(s => s.id === activeSectionId)
    const activeSection = activeSectionIndex >= 0 ? sectionRefs.current[activeSectionIndex] : null
    
    if (activeSection) {
      const sectionStart = activeSection.offsetLeft
      const sectionWidth = activeSection.offsetWidth
      const containerWidth = container.clientWidth
      const scrollLeft = container.scrollLeft
      
      const maxScroll = sectionStart + sectionWidth - containerWidth
      const progress = maxScroll > sectionStart 
        ? Math.max(0, Math.min(1, (scrollLeft - sectionStart) / (maxScroll - sectionStart)))
        : 0
      setScrollProgress(progress)
    } else {
      setScrollProgress(0)
    }
  }, [activeSectionId, sections])

  // Also listen to scroll events for more responsive updates
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const containerLeft = containerRect.left
      const containerWidth = containerRect.width
      const containerCenter = containerLeft + containerWidth / 2

      let closestSection = null
      let closestDistance = Infinity

      sectionRefs.current.forEach((ref) => {
        if (!ref) return
        const sectionRect = ref.getBoundingClientRect()
        const sectionCenter = sectionRect.left + sectionRect.width / 2
        const distance = Math.abs(sectionCenter - containerCenter)
        const visibilityRatio = Math.min(
          (sectionRect.right - containerLeft) / containerWidth,
          (containerLeft + containerWidth - sectionRect.left) / containerWidth
        )

        if (visibilityRatio >= 0.5 && distance < closestDistance) {
          closestDistance = distance
          closestSection = ref.id
        }
      })

      const currentActiveSection = closestSection || activeSectionId
      
      if (currentActiveSection) {
        setActiveSectionId(currentActiveSection)
      }

      // Calculate scroll progress for the active section
      const activeSectionIndex = sections.findIndex(s => s.id === currentActiveSection)
      const activeSection = activeSectionIndex >= 0 ? sectionRefs.current[activeSectionIndex] : null
      
      if (activeSection && container) {
        const sectionStart = activeSection.offsetLeft
        const sectionWidth = activeSection.offsetWidth
        const containerWidth = container.clientWidth
        const scrollLeft = container.scrollLeft
        
        // Progress is how much of the section has been scrolled past
        // When scrollLeft = sectionStart, progress = 0
        // When scrollLeft = sectionStart + sectionWidth - containerWidth, progress = 1
        const maxScroll = sectionStart + sectionWidth - containerWidth
        const progress = maxScroll > sectionStart 
          ? Math.max(0, Math.min(1, (scrollLeft - sectionStart) / (maxScroll - sectionStart)))
          : 0
        setScrollProgress(progress)
      } else {
        setScrollProgress(0)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Calculate and set section heights from the row's actual height (so min-height: 700px fills the panel)
  const NAV_AND_BORDER = 84 // 72px nav + 12px border

  useEffect(() => {
    const calculateSectionHeight = () => {
      if (!rowRef.current) return 0
      const rowHeight = rowRef.current.getBoundingClientRect().height
      return rowHeight - NAV_AND_BORDER
    }

    const setSectionHeights = () => {
      const height = calculateSectionHeight()
      if (height <= 0) return
      // Use setTimeout to ensure refs are populated after render
      setTimeout(() => {
        sectionRefs.current.forEach((ref) => {
          if (ref) {
            ref.style.setProperty('height', `${height}px`, 'important')
            ref.style.setProperty('min-height', `${height}px`, 'important')
          }
        })
      }, 0)
    }

    // Set initial height
    setSectionHeights()

    // Update when window resizes (row height may change, e.g. min-height kicking in)
    const handleResize = () => {
      setSectionHeights()
    }

    // Also observe the row so we react when its height changes (e.g. min-height)
    const rowEl = rowRef.current
    const resizeObserver = rowEl
      ? new ResizeObserver(() => {
          setSectionHeights()
        })
      : null
    if (resizeObserver && rowEl) resizeObserver.observe(rowEl)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeObserver && rowEl) resizeObserver.unobserve(rowEl)
    }
  }, [sections])

  const handleTabClick = (sectionId, index) => {
    const sectionRef = sectionRefs.current[index]
    if (sectionRef && scrollContainerRef.current) {
      sectionRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
      setActiveSectionId(sectionId)
    }
  }

  return (
    <section ref={rowRef} className={`project-row ${className}`.trim()}>
      <ProjectNav
        title={title}
        sections={sections}
        activeSectionId={activeSectionId}
        onTabClick={handleTabClick}
        scrollContainerRef={scrollContainerRef}
        isSticky={isNavSticky}
        color={color}
        showTabs={showNavTabs}
        hiddenTabIds={hiddenTabIds}
        scrollProgress={scrollProgress}
      />
      <div ref={scrollContainerRef} className="project-panel-container">
        <div className="project-panel-scroll">
          {sections.length > 0 ? (
            sections.map((section, index) => (
              <ProjectSection
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                id={section.id}
                isLast={index === sections.length - 1}
                backgroundColor={section.backgroundColor || backgroundColor}
                background={section.background}
                backstoryBgColor={backstoryBgColor}
                sectionStyle={section.sectionStyle}
              >
                {section.content || (
                  <div className="project-section-placeholder">
                    <p>
                      {section.id === 'dashboard' ? (
                        <>
                          Sorry – this section isn't done yet. <br />For full content, view my{' '}
                          <a href="https://coreystone.com" target="_blank" rel="noopener noreferrer">
                            current/old site
                          </a>
                          .
                        </>
                      ) : (
                        <>
                          Section {index + 1} placeholder for {section.label}.<br />
                          (for full content, view my{' '}
                          <a href="https://coreystone.com" target="_blank" rel="noopener noreferrer">
                            current/old site
                          </a>
                          )
                        </>
                      )}
                    </p>
                  </div>
                )}
              </ProjectSection>
            ))
          ) : (
            <div className="project-panel-placeholder">
              <p>Project content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProjectRow
