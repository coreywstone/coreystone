import { useState, useEffect } from 'react'

/**
 * Component that loads and renders SVG content inline
 * This allows @font-face declarations in SVG style blocks to work
 */
function InlineSVG({ src, alt = '', className = '', ...props }) {
  const [svgContent, setSvgContent] = useState(null)
  const [error, setError] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  // Preload fonts to ensure they're available when SVG renders
  useEffect(() => {
    const fontUrls = [
      '/fonts/animeace.woff',
      '/fonts/animeace_i.woff',
      '/fonts/animeace_b.woff'
    ]

    const loadFonts = async () => {
      try {
        await Promise.all(
          fontUrls.map(url => {
            return new Promise((resolve, reject) => {
              const link = document.createElement('link')
              link.rel = 'preload'
              link.as = 'font'
              link.type = 'font/woff'
              link.crossOrigin = 'anonymous'
              link.href = url
              link.onload = () => resolve()
              link.onerror = () => resolve() // Don't fail if preload fails
              document.head.appendChild(link)
            })
          })
        )
        setFontsLoaded(true)
      } catch (err) {
        console.warn('Font preload warning:', err)
        setFontsLoaded(true) // Continue anyway
      }
    }

    loadFonts()
  }, [])

  useEffect(() => {
    if (!src) return

    fetch(src)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load SVG')
        return response.text()
      })
      .then(text => {
        setSvgContent(text)
        setError(false)
      })
      .catch(err => {
        console.error('Error loading SVG:', err)
        setError(true)
      })
  }, [src])

  if (error) {
    // Fallback to img tag if loading fails
    return <img src={src} alt={alt} className={className} {...props} />
  }

  if (!svgContent || !fontsLoaded) {
    // Loading state - wait for both SVG and fonts
    return null
  }

  // Render SVG inline with dangerouslySetInnerHTML
  // This allows the @font-face declarations to work
  // The className is applied to the wrapper div for CSS positioning
  return (
    <div
      className={className}
      style={{ display: 'inline-block', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  )
}

export default InlineSVG

