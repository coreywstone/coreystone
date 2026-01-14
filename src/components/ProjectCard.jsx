import { useState } from 'react'
import './ProjectCard.css'

function ProjectCard({ image, text, url, onTriggerVortex, style, rotation = 0, isHovered, isClicked, isTall = false, onMouseEnter, onMouseLeave }) {
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsPressed(true)
  }

  const handleMouseUp = (e) => {
    e.preventDefault()
    if (isPressed) {
      setIsPressed(false)
      if (onTriggerVortex) {
        onTriggerVortex(url)
      }
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
  }

  const handleMouseEnterEvent = (e) => {
    if (onMouseEnter) {
      onMouseEnter()
    }
  }

  const handleMouseLeaveEvent = (e) => {
    if (!isClicked) {
      setIsPressed(false)
      if (onMouseLeave) {
        onMouseLeave()
      }
    }
  }

  return (
    <a
      href={url}
      className={`project-card ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''} ${isPressed ? 'pressed' : ''}`}
      style={{
        ...style,
        '--rotation': `${rotation}deg`,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnterEvent}
      onMouseLeave={handleMouseLeaveEvent}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={`project-card-image ${isTall ? 'tall' : ''}`}>
        <img src={image} alt="" />
      </div>
      <div className="project-card-text">
        {text}
      </div>
    </a>
  )
}

export default ProjectCard
