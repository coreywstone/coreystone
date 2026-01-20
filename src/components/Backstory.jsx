import { useContext } from 'react'
import { BackstoryContext } from './ProjectSection'
import './Backstory.css'

function Backstory({ children, backgroundColor, width, top, left, className = '' }) {
  const contextBgColor = useContext(BackstoryContext)
  
  const style = {
    backgroundColor: backgroundColor || contextBgColor || undefined,
    width: width || undefined,
    top: top || undefined,
    left: left || undefined
  }

  // Remove undefined values to avoid unnecessary inline styles
  Object.keys(style).forEach(key => {
    if (style[key] === undefined) {
      delete style[key]
    }
  })

  return (
    <div className={`backstory ${className}`.trim()} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </div>
  )
}

export default Backstory

