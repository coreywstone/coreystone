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
      // Use offsetWidth for actual rendered width, fallback to getBoundingClientRect
      const containerWidth = containerElement.offsetWidth || containerRect.width
      
      // Trigger when 50% of the panel is visible OR when panel width > 0 and some portion is visible
      const visibleRatio = containerWidth > 0 ? visibleWidth / containerWidth : 0
      
      // Also check if panel has any visible width at all (might be calculating before width is set)
      const hasAnyVisibility = visibleWidth > 100 // At least 100px visible
      const shouldTrigger = (visibleRatio >= 0.5 || hasAnyVisibility) && containerWidth > 500
      
      console.log('Nav panel visibility check:', { 
        visibleRatio, 
        visibleWidth, 
        containerWidth, 
        offsetWidth: containerElement.offsetWidth,
        hasAnimated,
        shouldTrigger,
        containerRect: { left: containerLeft, right: containerRight, width: containerRect.width },
        scrollRect: { left: scrollLeft, right: scrollRight }
      })
      
      if (shouldTrigger && !hasAnimated) {
        console.log('Nav panel triggering animations!')
        setIsVisible(true)
        setHasAnimated(true)
        
        // Show words 700ms later
        setTimeout(() => {
          console.log('Setting showWords to true')
          setShowWords(true)
          // Show ambiguous image 750ms after words appear
          setTimeout(() => {
            console.log('Setting showAmbiguous to true')
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
          
          // Check bottom stack container (left: 600px, flexbox with steps, stakeholders, user-panel)
          const bottomStack = panel.querySelector('.chegg-nav-bottom-stack')
          const iDiscoveredImg = panel.querySelector('.chegg-nav-i-discovered')
          const iterationImg = panel.querySelector('.chegg-nav-iteration')
          let stackRightEdge = 0
          
          if (bottomStack) {
            const stackRect = bottomStack.getBoundingClientRect()
            if (stackRect.width > 0) {
              stackRightEdge = 600 + stackRect.width
              requiredWidth = Math.max(requiredWidth, stackRightEdge + 12)
            }
          }
          
          // Check i-discovered image - now positioned relative to bottom stack right edge
          // I-discovered's right edge aligns with stack's right edge
          if (stackRightEdge > 0 && iDiscoveredImg) {
            const iDiscoveredRect = iDiscoveredImg.getBoundingClientRect()
            const iDiscoveredWidth = iDiscoveredRect.width > 0 ? iDiscoveredRect.width : (iDiscoveredImg.naturalWidth || 300)
            const iDiscoveredRight = stackRightEdge // I-discovered right edge aligns with stack right edge
            
            // If iteration image not loaded yet, just account for I-discovered
            requiredWidth = Math.max(requiredWidth, iDiscoveredRight + 12)
          }
          
          // Check iteration image - positioned immediately to the right of the stack
          if (stackRightEdge > 0 && iterationImg) {
            const iterationRect = iterationImg.getBoundingClientRect()
            if (iterationRect.width > 0) {
              // Iteration image starts at stackRightEdge, has left and right borders (12px each)
              const iterationRight = stackRightEdge + iterationRect.width + 24 // 12px left border + 12px right border
              requiredWidth = Math.max(requiredWidth, iterationRight + 12)
            } else if (iterationImg.naturalWidth > 0) {
              // Estimate based on natural width and panel height
              const panelRect = panel.getBoundingClientRect()
              const panelHeight = panelRect.height || 600
              const aspectRatio = iterationImg.naturalWidth / iterationImg.naturalHeight
              const estimatedIterationWidth = panelHeight * aspectRatio
              const iterationRight = stackRightEdge + estimatedIterationWidth + 24
              requiredWidth = Math.max(requiredWidth, iterationRight + 12)
            }
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
      const bottomStack = panel.querySelector('.chegg-nav-bottom-stack')
      const iDiscoveredImg = panel.querySelector('.chegg-nav-i-discovered')
      
      // Match user-panel height to stakeholders height
      const matchHeights = () => {
        const stakeholdersContainer = bottomStack?.querySelector('.chegg-nav-stakeholders .image-with-text')
        const userPanelContainer = bottomStack?.querySelector('.chegg-nav-user-panel .image-with-text')
        if (stakeholdersContainer && userPanelContainer) {
          const stakeholdersHeight = stakeholdersContainer.offsetHeight
          if (stakeholdersHeight > 0) {
            userPanelContainer.style.height = `${stakeholdersHeight}px`
          }
        }
      }
      
      // Position I-discovered SVG right-aligned with bottom stack, sitting on top of it
      const positionIDiscovered = () => {
        if (!bottomStack || !iDiscoveredImg || !panel) return
        
        const stackRect = bottomStack.getBoundingClientRect()
        const panelRect = panel.getBoundingClientRect()
        
        // Ensure we have valid dimensions
        if (!stackRect || !panelRect || stackRect.width <= 0 || panelRect.width <= 0) {
          console.log('i-discovered positioning: invalid dimensions', { stackRect, panelRect })
          // Retry after a short delay
          setTimeout(positionIDiscovered, 100)
          return
        }
        
        try {
          // Calculate right edge of stack relative to panel (left: 600px + width)
          const stackRightRelative = 600 + stackRect.width
          
          // Calculate right position for I-discovered
          const rightPosition = panelRect.width - stackRightRelative
          
          // Position I-discovered so its right edge aligns with stack's right edge
          iDiscoveredImg.style.right = `${Math.max(0, rightPosition)}px`
          
          // Position I-discovered on top of the flexbox
          // The flexbox is at bottom: 0, so we need to position I-discovered's bottom at the flexbox's top
          // Move down 4px to close the gap
          if (stackRect.height > 0) {
            iDiscoveredImg.style.bottom = `${stackRect.height - 4}px`
          } else {
            // Fallback: use offsetHeight if getBoundingClientRect height is 0
            const stackHeight = bottomStack.offsetHeight || 200
            iDiscoveredImg.style.bottom = `${stackHeight - 4}px`
          }
          
          // Ensure image is visible
          iDiscoveredImg.style.display = 'block'
          iDiscoveredImg.style.opacity = '1'
        } catch (error) {
          console.error('Error positioning i-discovered:', error)
        }
      }
      
      // Check steps image in bottom stack and set scaled width
      if (bottomStack) {
        const stepsWrapper = bottomStack.querySelector('.chegg-nav-steps-wrapper')
        const stepsImg = bottomStack.querySelector('.chegg-nav-steps')
        const setStepsWidth = () => {
          if (stepsImg && stepsWrapper) {
            // Set image dimensions to 80% of natural size
            if (stepsImg.naturalWidth > 0 && stepsImg.naturalHeight > 0) {
              stepsImg.style.width = `${stepsImg.naturalWidth * 0.8}px`
              stepsImg.style.height = `${stepsImg.naturalHeight * 0.8}px`
              positionIDiscovered()
            } else {
              // Fallback: wait for natural dimensions
              const checkDimensions = () => {
                if (stepsImg.naturalWidth > 0 && stepsImg.naturalHeight > 0) {
                  stepsImg.style.width = `${stepsImg.naturalWidth * 0.8}px`
                  stepsImg.style.height = `${stepsImg.naturalHeight * 0.8}px`
                  positionIDiscovered()
                } else {
                  setTimeout(checkDimensions, 50)
                }
              }
              checkDimensions()
            }
          }
        }
        
        if (stepsImg) {
          if (stepsImg.complete) {
            setTimeout(setStepsWidth, 50)
            handleImageLoad()
            matchHeights()
          } else {
            stepsImg.addEventListener('load', () => {
              setTimeout(setStepsWidth, 50)
              handleImageLoad()
              matchHeights()
            }, { once: true })
          }
        }
        
        // For ImageWithText components, find the img inside
        const stakeholdersContainer = bottomStack.querySelector('.chegg-nav-stakeholders')
        const userPanelContainer = bottomStack.querySelector('.chegg-nav-user-panel')
        
        if (stakeholdersContainer) {
          const stakeholdersImg = stakeholdersContainer.querySelector('img')
          if (stakeholdersImg) {
            if (stakeholdersImg.complete) {
              handleImageLoad()
              matchHeights()
            } else {
              stakeholdersImg.addEventListener('load', () => {
                handleImageLoad()
                matchHeights()
              }, { once: true })
            }
          }
        }
        
        if (userPanelContainer) {
          const userPanelImg = userPanelContainer.querySelector('img')
          if (userPanelImg) {
            if (userPanelImg.complete) {
              handleImageLoad()
              matchHeights()
            } else {
              userPanelImg.addEventListener('load', () => {
                handleImageLoad()
                matchHeights()
              }, { once: true })
            }
          }
        }
        
        // Also try to match heights after a short delay
        setTimeout(matchHeights, 200)
      }
      
        if (iDiscoveredImg) {
          const handleIDiscoveredLoad = () => {
            handleImageLoad()
            // Position multiple times to ensure it works
            setTimeout(positionIDiscovered, 50)
            setTimeout(positionIDiscovered, 200)
            setTimeout(positionIDiscovered, 500)
          }
          if (iDiscoveredImg.complete) {
            handleIDiscoveredLoad()
          } else {
            iDiscoveredImg.addEventListener('load', handleIDiscoveredLoad, { once: true })
          }
        }
        
        // Also position after all images load, with multiple retries
        setTimeout(() => {
          positionIDiscovered()
        }, 300)
        setTimeout(() => {
          positionIDiscovered()
        }, 600)
        setTimeout(() => {
          positionIDiscovered()
        }, 1000)
      
      const iterationImg = panel.querySelector('.chegg-nav-iteration')
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

  // Position iteration image immediately to the right of the bottom stack
  useEffect(() => {
    const panel = containerRef.current
    if (!panel) return
    
    const bottomStack = panel.querySelector('.chegg-nav-bottom-stack')
    const iterationImg = iterationFigmasRef.current
    if (!bottomStack || !iterationImg) return

    const updatePosition = () => {
      const stackRect = bottomStack.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()
      if (stackRect && panelRect && stackRect.width > 0) {
        // Position immediately to the right of the stack (left: 600px + stack width)
        const stackRight = 600 + stackRect.width
        iterationImg.style.left = `${stackRight}px`
        // Set height to fill panel height
        iterationImg.style.height = `${panelRect.height}px`
        iterationImg.style.width = 'auto'
      }
    }

    // Update position when images load
    const handleLoad = () => {
      setTimeout(updatePosition, 50)
    }

    if (bottomStack) {
      // Use ResizeObserver to watch for stack size changes
      const resizeObserver = new ResizeObserver(() => {
        updatePosition()
      })
      resizeObserver.observe(bottomStack)
      
      if (iterationImg.complete) {
        handleLoad()
      } else {
        iterationImg.addEventListener('load', handleLoad, { once: true })
      }

      window.addEventListener('resize', updatePosition)
      
      return () => {
        resizeObserver.disconnect()
        iterationImg.removeEventListener('load', handleLoad)
        window.removeEventListener('resize', updatePosition)
      }
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
        onLoad={() => {
          console.log('me-ambiguous-problem.svg loaded, showAmbiguous:', showAmbiguous, 'element:', ambiguousImageRef.current?.getBoundingClientRect())
        }}
      />
      <img
        ref={iterationFigmasRef}
        src="/img/chegg/chegg-nav-iteration.png"
        alt="Iteration"
        className="chegg-nav-iteration"
        onError={(e) => console.error('Failed to load chegg-nav-iteration.png', e)}
      />
      <div className="chegg-nav-bottom-stack">
        <div className="chegg-nav-steps-wrapper">
          <img
            src="/img/me/steps.svg"
            alt="Steps"
            className="chegg-nav-steps"
            onError={(e) => console.error('Failed to load me/steps.svg', e)}
          />
        </div>
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
            className="no-left-border same-height-as-stakeholders"
          />
        </div>
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
