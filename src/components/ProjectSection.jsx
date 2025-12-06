import { forwardRef } from 'react'
import './ProjectSection.css'

const ProjectSection = forwardRef(({ id, children, isLast, backgroundColor = null }, ref) => {
  const sectionStyle = backgroundColor ? { '--custom-bg-color': backgroundColor } : undefined
  const className = `project-section ${isLast ? 'last' : ''} ${backgroundColor ? 'custom-background' : ''}`
  
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

ProjectSection.displayName = 'ProjectSection'

export default ProjectSection

