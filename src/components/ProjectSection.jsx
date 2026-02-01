import { createContext, forwardRef } from 'react'
import './ProjectSection.css'

export const BackstoryContext = createContext(null)

const ProjectSection = forwardRef(({ id, children, isLast, backgroundColor = null, background = null, backstoryBgColor = null, sectionStyle: sectionStyleOverride = null }, ref) => {
  const sectionStyle = {
    ...(background ? { '--custom-bg': background } : backgroundColor ? { '--custom-bg-color': backgroundColor } : {}),
    ...sectionStyleOverride
  }
  const className = [
    'project-section',
    isLast ? 'last' : '',
    background ? 'custom-background-image' : '',
    backgroundColor && !background ? 'custom-background' : ''
  ].filter(Boolean).join(' ')
  
  return (
    <BackstoryContext.Provider value={backstoryBgColor}>
      <section
        ref={ref}
        id={id}
        className={className}
        style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
      >
        {children}
      </section>
    </BackstoryContext.Provider>
  )
})

ProjectSection.displayName = 'ProjectSection'

export default ProjectSection

