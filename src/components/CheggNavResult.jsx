import { useEffect, useRef } from 'react'
import './CheggNavResult.css'

function CheggNavResult() {
  const containerRef = useRef(null)
  const oldNavRef = useRef(null)
  const newNavRef = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => {
    const panel = containerRef.current
    if (!panel) return

    const setImageSizes = () => {
      if (oldNavRef.current && oldNavRef.current.naturalWidth > 0) {
        oldNavRef.current.style.width = `${oldNavRef.current.naturalWidth / 2}px`
        oldNavRef.current.style.height = `${oldNavRef.current.naturalHeight / 2}px`
      }
      if (newNavRef.current && newNavRef.current.naturalWidth > 0 && panel) {
        // newnav should fill panel height, so calculate width based on aspect ratio
        const panelHeight = panel.offsetHeight || panel.getBoundingClientRect().height || 600
        const aspectRatio = newNavRef.current.naturalWidth / newNavRef.current.naturalHeight
        // Since image is at 2x, we use naturalWidth/2 and naturalHeight/2 for aspect ratio
        const scaledAspectRatio = (newNavRef.current.naturalWidth / 2) / (newNavRef.current.naturalHeight / 2)
        const calculatedWidth = panelHeight * scaledAspectRatio
        newNavRef.current.style.height = `${panelHeight}px`
        newNavRef.current.style.width = `${calculatedWidth}px`
      }
    }

    const calculatePanelWidth = () => {
      if (!oldNavRef.current || !newNavRef.current || !panel) return

      // Set oldnav size
      if (oldNavRef.current && oldNavRef.current.naturalWidth > 0) {
        oldNavRef.current.style.width = `${oldNavRef.current.naturalWidth / 2}px`
        oldNavRef.current.style.height = `${oldNavRef.current.naturalHeight / 2}px`
      }

      // Set newnav size based on panel height
      const panelHeight = panel.offsetHeight || panel.getBoundingClientRect().height || 600
      if (newNavRef.current && newNavRef.current.naturalWidth > 0) {
        const scaledAspectRatio = (newNavRef.current.naturalWidth / 2) / (newNavRef.current.naturalHeight / 2)
        const calculatedWidth = panelHeight * scaledAspectRatio
        newNavRef.current.style.height = `${panelHeight}px`
        newNavRef.current.style.width = `${calculatedWidth}px`
      }

      // Set result svg size based on panel height
      if (resultRef.current && resultRef.current.naturalWidth > 0) {
        const resultAspectRatio = resultRef.current.naturalWidth / resultRef.current.naturalHeight
        const resultWidth = panelHeight * resultAspectRatio
        resultRef.current.style.height = `${panelHeight}px`
        resultRef.current.style.width = `${resultWidth}px`
      }

      // Wait a bit for sizes to apply, then calculate panel width
      setTimeout(() => {
        const oldNavWidth = oldNavRef.current.offsetWidth || oldNavRef.current.naturalWidth / 2 || 0
        const newNavWidth = newNavRef.current.offsetWidth || 0
        const resultWidth = resultRef.current?.offsetWidth || 0

        if (oldNavWidth > 0 && newNavWidth > 0) {
          // Calculate required width: oldNav at left: 32px, newNav positioned 48px to the right of oldNav's right edge
          const oldNavRight = 32 + oldNavWidth
          const newNavLeft = oldNavRight + 48
          const newNavRight = newNavLeft + newNavWidth
          
          // Panel width = newnav right edge + 32px gap - 112px (result moved left) + result width (no padding on right)
          // The panel's right edge should touch the container edge, so no extra padding
          const requiredWidth = newNavRight + 32 - 112 + resultWidth

          panel.style.setProperty('width', `${requiredWidth}px`, 'important')
          panel.style.setProperty('min-width', `${requiredWidth}px`, 'important')
          
          // Position result png 32px after newnav's right edge, then move 112px left (80px + 32px)
          if (resultRef.current) {
            resultRef.current.style.left = `${newNavRight + 32 - 112}px`
          }
        } else if (oldNavWidth > 0) {
          // If only oldnav is loaded, estimate minimum width
          const estimatedNewNavWidth = newNavRef.current.naturalWidth > 0 ? (panelHeight * (newNavRef.current.naturalWidth / 2) / (newNavRef.current.naturalHeight / 2)) : 400
          const estimatedWidth = Math.max(32 + oldNavWidth + 48 + estimatedNewNavWidth + 32, 800)
          panel.style.setProperty('width', `${estimatedWidth}px`, 'important')
          panel.style.setProperty('min-width', `${estimatedWidth}px`, 'important')
        }
      }, 50)
    }

    const positionNewNav = () => {
      if (!oldNavRef.current || !newNavRef.current || !panel) return

      // Set image sizes first (including newnav height fill)
      setImageSizes()

      setTimeout(() => {
        const oldNavWidth = oldNavRef.current.offsetWidth
        if (oldNavWidth > 0) {
          // oldNav is at left: 32px, so its right edge is at 32px + width
          // Position newNav's left edge 48px to the right of oldNav's right edge
          const oldNavRight = 32 + oldNavWidth
          newNavRef.current.style.left = `${oldNavRight + 48}px`
          
          // Recalculate newnav size now that we have panel dimensions
          if (newNavRef.current.naturalWidth > 0) {
            const panelHeight = panel.offsetHeight || panel.getBoundingClientRect().height
            if (panelHeight > 0) {
              const scaledAspectRatio = (newNavRef.current.naturalWidth / 2) / (newNavRef.current.naturalHeight / 2)
              const calculatedWidth = panelHeight * scaledAspectRatio
              newNavRef.current.style.height = `${panelHeight}px`
              newNavRef.current.style.width = `${calculatedWidth}px`
              
              // Position result png 32px after newnav's right edge, then move 112px left (80px + 32px)
              if (resultRef.current) {
                const newNavRight = oldNavRight + 48 + calculatedWidth
                resultRef.current.style.left = `${newNavRight + 32 - 112}px`
                
                // Set result svg to fill panel height
                if (resultRef.current.naturalWidth > 0) {
                  const resultAspectRatio = resultRef.current.naturalWidth / resultRef.current.naturalHeight
                  const resultWidth = panelHeight * resultAspectRatio
                  resultRef.current.style.height = `${panelHeight}px`
                  resultRef.current.style.width = `${resultWidth}px`
                }
              }
            }
          }
        }
      }, 50)
    }

    // Position and calculate width when images load
    const handleImageLoad = () => {
      setTimeout(() => {
        positionNewNav()
        calculatePanelWidth()
      }, 50)
    }

    if (oldNavRef.current) {
      if (oldNavRef.current.complete && oldNavRef.current.naturalWidth > 0) {
        handleImageLoad()
      } else {
        oldNavRef.current.addEventListener('load', handleImageLoad, { once: true })
      }
    }

    if (newNavRef.current) {
      if (newNavRef.current.complete && newNavRef.current.naturalWidth > 0) {
        handleImageLoad()
      } else {
        newNavRef.current.addEventListener('load', handleImageLoad, { once: true })
      }
    }

    if (resultRef.current) {
      if (resultRef.current.complete && resultRef.current.naturalWidth > 0) {
        handleImageLoad()
      } else {
        resultRef.current.addEventListener('load', handleImageLoad, { once: true })
      }
    }

    // Also recalculate on resize
    const handleResize = () => {
      positionNewNav()
      calculatePanelWidth()
    }
    window.addEventListener('resize', handleResize)

    // Try calculating width multiple times to handle async loading
    setTimeout(calculatePanelWidth, 100)
    setTimeout(calculatePanelWidth, 300)
    setTimeout(calculatePanelWidth, 600)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="chegg-nav-result-panel">
      <img
        ref={oldNavRef}
        src="/img/chegg/chegg-nav-oldnav.png"
        alt="Old nav"
        className="chegg-nav-oldnav"
        onError={(e) => console.error('Failed to load chegg-nav-oldnav.png', e)}
      />
      <img
        ref={newNavRef}
        src="/img/chegg/chegg-nav-newnav.png"
        alt="New nav"
        className="chegg-nav-newnav"
        onError={(e) => console.error('Failed to load chegg-nav-newnav.png', e)}
      />
      <img
        ref={resultRef}
        src="/img/chegg/chegg-nav-result.png"
        alt="Result"
        className="chegg-nav-result"
        onError={(e) => console.error('Failed to load chegg-nav-result.png', e)}
      />
    </div>
  )
}

export default CheggNavResult
