import './ProjectCard.css'

function ProjectCard({ image, text, style, rotation = 0, isHovered, isTall = false, onMouseEnter, onMouseLeave }) {
  const handleMouseEnterEvent = () => {
    if (onMouseEnter) {
      onMouseEnter()
    }
  }

  const handleMouseLeaveEvent = () => {
    if (onMouseLeave) {
      onMouseLeave()
    }
  }

  return (
    <div
      className={`project-card ${isHovered ? 'hovered' : ''}`}
      style={{
        ...style,
        '--rotation': `${rotation}deg`,
      }}
      onMouseEnter={handleMouseEnterEvent}
      onMouseLeave={handleMouseLeaveEvent}
    >
      <div className={`project-card-image ${isTall ? 'tall' : ''}`}>
        <img src={image} alt="" loading="lazy" />
      </div>
      <div className="project-card-text">
        {text}
      </div>
    </div>
  )
}

export default ProjectCard
