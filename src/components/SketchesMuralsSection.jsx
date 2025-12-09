import { forwardRef } from 'react'
import './SketchesMuralsSection.css'

const SketchesMuralsSection = forwardRef(({ id, children, isLast, backgroundColor = null }, ref) => {
  const sectionStyle = backgroundColor ? { '--custom-bg-color': backgroundColor } : undefined
  const className = `sketches-murals-section ${isLast ? 'last' : ''} ${backgroundColor ? 'custom-background' : ''}`
  
  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={sectionStyle}
    >
      {children}
    </section>
  )
})

SketchesMuralsSection.displayName = 'SketchesMuralsSection'

export default SketchesMuralsSection
