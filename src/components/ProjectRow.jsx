import { useEffect, useRef, useState } from 'react'
import ProjectNav from './ProjectNav'
import ProjectSection from './ProjectSection'
import './ProjectRow.css'

function ProjectRow({ title, sections = [], color = '#F5EFE7', showNavTabs = true, backgroundColor = null, backstoryBgColor = null, className = '' }) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || null)
  const [isNavSticky, setIsNavSticky] = useState(false)
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

      if (closestSection) {
        setActiveSectionId(closestSection)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Calculate and set section heights based on viewport
  useEffect(() => {
    const calculateSectionHeight = () => {
      const viewportHeight = window.innerHeight
      const sectionHeight = viewportHeight - 84 // 72px nav + 12px border
      return sectionHeight
    }

    const setSectionHeights = () => {
      const height = calculateSectionHeight()
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

    // Handle resize
    const handleResize = () => {
      setSectionHeights()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
                backgroundColor={backgroundColor}
                backstoryBgColor={backstoryBgColor}
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
