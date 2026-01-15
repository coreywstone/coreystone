import { useEffect, useRef, useState } from 'react'
import Backstory from './Backstory'
import ImageWithText from './ImageWithText'
import './CheggNav.css'

function CheggNav() {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showWords, setShowWords] = useState(false)
  const [showAmbiguous, setShowAmbiguous] = useState(false)
  const andrewImageRef = useRef(null)
  const ambiguousImageRef = useRef(null)
  const iterationFigmasRef = useRef(null)

  useEffect(() => {
    const containerElement = containerRef.current
    if (!containerElement) return

    // Find the scrollable container (project-panel-container)
    const scrollContainer = containerElement.closest('.project-panel-container')
    if (!scrollContainer) return

    const checkVisibility = () => {
      const containerRect = containerElement.getBoundingClientRect()
      const scrollRect = scrollContainer.getBoundingClientRect()
      
      // Calculate how much of the panel is visible horizontally
      const containerLeft = containerRect.left
      const containerRight = containerRect.right
      const scrollLeft = scrollRect.left
      const scrollRight = scrollRect.right
      
      // Calculate visible width
      const visibleLeft = Math.max(containerLeft, scrollLeft)
      const visibleRight = Math.min(containerRight, scrollRight)
      const visibleWidth = Math.max(0, visibleRight - visibleLeft)
      const containerWidth = containerRect.width
      
      // Trigger when 50% of the panel is visible
      const visibleRatio = visibleWidth / containerWidth
      if (visibleRatio >= 0.5 && !hasAnimated) {
        setIsVisible(true)
        setHasAnimated(true)
        
        // Show words 700ms later
        setTimeout(() => {
          setShowWords(true)
          // Show ambiguous image 750ms after words appear
          setTimeout(() => {
            setShowAmbiguous(true)
          }, 750)
        }, 700)
      }
    }

    // Check initially
    checkVisibility()

    // Listen to scroll events on the container
    scrollContainer.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [hasAnimated])

  // Set image heights and calculate panel width to fit all content
  useEffect(() => {
    const andrewImg = andrewImageRef.current
    const ambiguousImg = ambiguousImageRef.current
    const panel = containerRef.current
    if (!andrewImg || !panel) return

    const calculatePanelWidth = () => {
      // Set Andrew image height to 400px
      const targetHeight = 400
      andrewImg.style.height = `${targetHeight}px`
      andrewImg.style.width = 'auto'
      
      // Wait a bit for images to render, then calculate
      setTimeout(() => {
        requestAnimationFrame(() => {
          let requiredWidth = 450 // minimum for ambiguous image position at left: 450px
          
          // Calculate width needed for ambiguous image (450px left + image width + 12px border)
          if (ambiguousImg) {
            // Try multiple methods to get the image width
            const ambiguousRect = ambiguousImg.getBoundingClientRect()
            let ambiguousWidth = 0
            
            if (ambiguousRect.width > 0) {
              ambiguousWidth = ambiguousRect.width
            } else if (ambiguousImg.offsetWidth > 0) {
              ambiguousWidth = ambiguousImg.offsetWidth
            } else if (ambiguousImg.naturalWidth && ambiguousImg.naturalWidth > 0) {
              // For SVG, naturalWidth might be the viewBox width
              ambiguousWidth = ambiguousImg.naturalWidth
            } else {
              // Fallback: try to get dimensions from the SVG element itself
              const svgElement = ambiguousImg.querySelector ? ambiguousImg.querySelector('svg') : null
              if (svgElement) {
                const svgRect = svgElement.getBoundingClientRect()
                if (svgRect.width > 0) {
                  ambiguousWidth = svgRect.width
                } else if (svgElement.viewBox && svgElement.viewBox.baseVal) {
                  ambiguousWidth = svgElement.viewBox.baseVal.width
                }
              }
            }
            
            if (ambiguousWidth > 0) {
              requiredWidth = 450 + ambiguousWidth + 12
            } else {
              // Last resort: estimate based on a reasonable size (SVGs are often around 200-400px wide)
              requiredWidth = 450 + 300 + 12 // 300px estimate + 12px border
            }
          }
          
          // Also check if Andrew image or words extend beyond
          const andrewRect = andrewImg.getBoundingClientRect()
          if (andrewRect.width > 0) {
            requiredWidth = Math.max(requiredWidth, andrewRect.width + 12)
          } else if (andrewImg.naturalWidth && andrewImg.naturalHeight > 0) {
            const andrewAspectRatio = andrewImg.naturalWidth / andrewImg.naturalHeight
            const estimatedAndrewWidth = targetHeight * andrewAspectRatio
            requiredWidth = Math.max(requiredWidth, estimatedAndrewWidth + 12)
          }
          
          // Account for the rightmost image at left: 1700px
          // Need to check all images to find the rightmost edge
          const stakeholdersContainer = panel.querySelector('.chegg-nav-stakeholders')
          const userPanelContainer = panel.querySelector('.chegg-nav-user-panel')
          const iDiscoveredImg = panel.querySelector('.chegg-nav-i-discovered')
          
          // Check stakeholders container (left: 850px)
          if (stakeholdersContainer) {
            const stakeholdersRect = stakeholdersContainer.getBoundingClientRect()
            if (stakeholdersRect.width > 0) {
              requiredWidth = Math.max(requiredWidth, 850 + stakeholdersRect.width + 12)
            }
          }
          
          // Check user panel container (left: 1238px)
          if (userPanelContainer) {
            const userPanelRect = userPanelContainer.getBoundingClientRect()
            if (userPanelRect.width > 0) {
              requiredWidth = Math.max(requiredWidth, 1238 + userPanelRect.width + 12)
            }
          }
          
          // Check i-discovered image (left: 1626px)
          const iterationImg = panel.querySelector('.chegg-nav-iteration-figmas')
          if (iDiscoveredImg) {
            const iDiscoveredRect = iDiscoveredImg.getBoundingClientRect()
            const iDiscoveredWidth = iDiscoveredRect.width > 0 ? iDiscoveredRect.width : (iDiscoveredImg.naturalWidth || 300)
            const iDiscoveredRight = 1626 + iDiscoveredWidth
            
            // Iteration-figmas left edge is at -12px from I-discovered's right edge
            // It's 1238px wide, so its right edge extends to iDiscoveredRight - 12 + 1238
            if (iterationImg) {
              const iterationRight = iDiscoveredRight - 12 + 1238
              requiredWidth = Math.max(requiredWidth, iterationRight + 12)
            } else {
              // If iteration image not loaded yet, just account for I-discovered
              requiredWidth = Math.max(requiredWidth, 1626 + iDiscoveredWidth + 12)
            }
          } else if (iterationImg) {
            // If I-discovered not loaded but iteration is, use fallback
            const iDiscoveredRight = 1626 + 300 // Estimate I-discovered width as 300px
            const iterationRight = iDiscoveredRight - 12 + 1238
            requiredWidth = Math.max(requiredWidth, iterationRight + 12)
          }
          
          // Ensure minimum width (at least enough for i-discovered image at 1700px + estimated width)
          requiredWidth = Math.max(requiredWidth, 2000)
          
          // Force the width with !important via setProperty
          panel.style.setProperty('width', `${requiredWidth}px`, 'important')
          panel.style.setProperty('min-width', `${requiredWidth}px`, 'important')
          
          console.log('Nav panel width calculated:', requiredWidth, 'ambiguous width:', ambiguousImg ? (ambiguousImg.getBoundingClientRect().width || ambiguousImg.offsetWidth || 'unknown') : 'no img', 'ambiguous left:', ambiguousImg ? ambiguousImg.getBoundingClientRect().left : 'no img')
        })
      }, 100) // Small delay to ensure images are rendered
    }

    // Set up load listeners for all images
    const handleImageLoad = () => {
      calculatePanelWidth()
    }

    // Try to calculate immediately if images are loaded
    if (andrewImg.complete && andrewImg.naturalHeight > 0) {
      handleImageLoad()
    } else {
      andrewImg.addEventListener('load', handleImageLoad, { once: true })
    }

    if (ambiguousImg) {
      if (ambiguousImg.complete) {
        handleImageLoad()
      } else {
        ambiguousImg.addEventListener('load', handleImageLoad, { once: true })
      }
    }
    
    // Add load listeners for new images - use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const stakeholdersContainer = panel.querySelector('.chegg-nav-stakeholders')
      const userPanelContainer = panel.querySelector('.chegg-nav-user-panel')
      const iDiscoveredImg = panel.querySelector('.chegg-nav-i-discovered')
      
      // For ImageWithText components, find the img inside
      if (stakeholdersContainer) {
        const stakeholdersImg = stakeholdersContainer.querySelector('img')
        if (stakeholdersImg) {
          if (stakeholdersImg.complete) {
            handleImageLoad()
          } else {
            stakeholdersImg.addEventListener('load', handleImageLoad, { once: true })
          }
        }
      }
      
      if (userPanelContainer) {
        const userPanelImg = userPanelContainer.querySelector('img')
        if (userPanelImg) {
          if (userPanelImg.complete) {
            handleImageLoad()
          } else {
            userPanelImg.addEventListener('load', handleImageLoad, { once: true })
          }
        }
      }
      
      if (iDiscoveredImg) {
        if (iDiscoveredImg.complete) {
          handleImageLoad()
        } else {
          iDiscoveredImg.addEventListener('load', handleImageLoad, { once: true })
        }
      }
      
      const iterationImg = panel.querySelector('.chegg-nav-iteration-figmas')
      if (iterationImg) {
        if (iterationImg.complete) {
          handleImageLoad()
        } else {
          iterationImg.addEventListener('load', handleImageLoad, { once: true })
        }
      }
    }, 0)

    // Also recalculate on window resize
    const handleResize = () => {
      calculatePanelWidth()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      andrewImg.removeEventListener('load', handleImageLoad)
      if (ambiguousImg) {
        ambiguousImg.removeEventListener('load', handleImageLoad)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Position iteration-figmas image at -12px from I-discovered's right edge
  useEffect(() => {
    const panel = containerRef.current
    if (!panel) return
    
    const iDiscoveredImg = panel.querySelector('.chegg-nav-i-discovered')
    const iterationImg = iterationFigmasRef.current
    if (!iDiscoveredImg || !iterationImg) return

    const updatePosition = () => {
      const iDiscoveredRect = iDiscoveredImg.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()
      if (iDiscoveredRect && panelRect) {
        const iDiscoveredRight = iDiscoveredRect.right - panelRect.left
        // Position left edge at -12px from i-discovered's right edge
        iterationImg.style.left = `${iDiscoveredRight - 12}px`
      }
    }

    // Update position when images load
    const handleLoad = () => {
      setTimeout(updatePosition, 50)
    }

    if (iDiscoveredImg.complete) {
      handleLoad()
    } else {
      iDiscoveredImg.addEventListener('load', handleLoad, { once: true })
    }

    if (iterationImg.complete) {
      handleLoad()
    } else {
      iterationImg.addEventListener('load', handleLoad, { once: true })
    }

    window.addEventListener('resize', updatePosition)
    
    return () => {
      iDiscoveredImg.removeEventListener('load', handleLoad)
      iterationImg.removeEventListener('load', handleLoad)
      window.removeEventListener('resize', updatePosition)
    }
  }, [])

  return (
    <div ref={containerRef} className="chegg-nav-panel">
      {/* Nav-problem panel */}
      <Backstory top={0} left={0}>
        We sell our async "flexible" courses as a B2B2C employee benefit in the Guild marketplace, with certain deadline-based completion rates. Problem is...
      </Backstory>
      <img
        ref={andrewImageRef}
        src="/img/chegg/chegg-andrew.jpg"
        alt="Andrew"
        className="chegg-nav-andrew"
        onError={(e) => console.error('Failed to load chegg-andrew.jpg', e)}
      />
      <img
        src="/img/chegg/chegg-andrew-words.svg"
        alt="Andrew words"
        className={`chegg-nav-words ${showWords ? 'visible' : ''}`}
        onError={(e) => console.error('Failed to load chegg-andrew-words.svg', e)}
      />
      <img
        ref={ambiguousImageRef}
        src="/img/me/me-ambiguous-problem.svg"
        alt="Ambiguous problem"
        className={`chegg-nav-ambiguous ${showAmbiguous ? 'animate' : ''}`}
        onError={(e) => console.error('Failed to load me-ambiguous-problem.svg', e)}
      />
      <img
        ref={iterationFigmasRef}
        src="/img/chegg/chegg-nav-iteration-figmas.jpg"
        alt="Iteration figmas"
        className="chegg-nav-iteration-figmas"
        onError={(e) => console.error('Failed to load chegg-nav-iteration-figmas.jpg', e)}
      />
      <div className="chegg-nav-stakeholders">
        <ImageWithText
          imageSrc="/img/chegg/chegg-nav-stakeholders.jpg"
          text="First, I met with our Support & success-coach managers who know the problem best."
          textPosition="top"
          alt="Stakeholders"
        />
      </div>
      <div className="chegg-nav-user-panel">
        <ImageWithText
          imageSrc="/img/chegg/chegg-user-panel.jpg"
          text="I talked to our students via UserTesting 
and weekly student panel Zooms."
          textPosition="top"
          alt="User panel"
        />
      </div>
      <img
        src="/img/chegg/chegg-nav-i-discovered.svg"
        alt="I discovered"
        className="chegg-nav-i-discovered"
        onError={(e) => console.error('Failed to load chegg-nav-i-discovered.svg', e)}
      />
    </div>
  )
}

export default CheggNav
