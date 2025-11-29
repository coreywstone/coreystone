import { forwardRef } from 'react'
import './ProjectSection.css'

const ProjectSection = forwardRef(({ id, children, isLast }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={`project-section ${isLast ? 'last' : ''}`}
    >
      {children}
    </section>
  )
})

ProjectSection.displayName = 'ProjectSection'

export default ProjectSection

