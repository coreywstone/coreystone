import { useEffect, useRef, useState } from 'react'
import SketchesMuralsNav from './SketchesMuralsNav'
import SketchesMuralsSection from './SketchesMuralsSection'
import './SketchesMuralsRow.css'
import './TextboxImagePair.css'

function MuralsRow() {
  const muralsSections = [
    { 
      id: 'murals', 
      label: 'MURALS',
      content: (
        <div className="textbox-image-pair">
          <div
            className="textbox-image-pair-image-container"
            style={{ flexDirection: 'row', gap: '32px', padding: '0 32px 0 32px', position: 'relative' }}
          >
            <img
              src="/img/me/me-painting.png"
              alt="Everyone paints floor-to-ceiling murals on their kids' rooms, right? No? Hmmm. Since we moved a couple times, I ended up free-hand painting 4 rooms – here's two:"
              className="textbox-image-pair-image"
              style={{ marginRight: '-90px', position: 'relative', zIndex: 2, boxShadow: 'none' }}
            />
            <img
              src="/img/murals/nemo-panorama-upscaled.jpg"
              alt="Eli's Nemo painted mural room"
              loading="lazy"
              className="textbox-image-pair-image"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
            <img
              src="/img/murals/CT-room-murals.jpg"
              alt="Christopher's Tarzan/Jungle Book painted mural room"
              loading="lazy"
              className="textbox-image-pair-image"
              style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
        </div>
      )
    }
  ]

  const [activeSectionId, setActiveSectionId] = useState(muralsSections[0]?.id || null)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const scrollContainerRef = useRef(null)
  const sectionRefs = useRef([])
  const rowRef = useRef(null)

  // Background color mapping for specific panels
  const getBackgroundColor = (sectionId, index) => {
    // First panel (murals) = Blackish
    if (index === 0) return "#262629"
    
    // Default to Marble for all other panels
    return "#CED4E0"
  }

  // Set up IntersectionObserver to detect when MuralsRow is in view (for sticky nav)
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
    if (muralsSections.length === 0 || !scrollContainerRef.current) return

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
  }, [muralsSections])

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
  }, [muralsSections])

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

  const handleTitleClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section ref={rowRef} className="sketches-murals-row">
      <SketchesMuralsNav
        title="Murals"
        sections={muralsSections}
        activeSectionId={activeSectionId}
        onTabClick={handleTabClick}
        scrollContainerRef={scrollContainerRef}
        isSticky={isNavSticky}
        color="#F5EFE7"
        showTabs={false}
        onTitleClick={handleTitleClick}
      />
      <div ref={scrollContainerRef} className="sketches-murals-panel-container">
        <div className="sketches-murals-panel-scroll">
          {muralsSections.length > 0 ? (
            muralsSections.map((section, index) => (
              <SketchesMuralsSection
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                id={section.id}
                isLast={index === muralsSections.length - 1}
                backgroundColor={getBackgroundColor(section.id, index)}
              >
                {section.content || (
                  <div className="sketches-murals-section-placeholder">
                    <p>[ Section {index + 1}: {section.label} ]</p>
                  </div>
                )}
              </SketchesMuralsSection>
            ))
          ) : (
            <div className="sketches-murals-panel-placeholder">
              <p>Project content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MuralsRow
