import { createContext, forwardRef } from 'react'
import './ProjectSection.css'

export const BackstoryContext = createContext(null)

const ProjectSection = forwardRef(({ id, children, isLast, backgroundColor = null, backstoryBgColor = null }, ref) => {
  const sectionStyle = backgroundColor ? { '--custom-bg-color': backgroundColor } : undefined
  const className = `project-section ${isLast ? 'last' : ''} ${backgroundColor ? 'custom-background' : ''}`
  
  return (
    <BackstoryContext.Provider value={backstoryBgColor}>
      <section
        ref={ref}
        id={id}
        className={className}
        style={sectionStyle}
      >
        {children}
      </section>
    </BackstoryContext.Provider>
  )
})

ProjectSection.displayName = 'ProjectSection'

export default ProjectSection

