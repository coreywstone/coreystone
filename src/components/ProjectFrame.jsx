import './ProjectFrame.css'

function ProjectFrame({ image, imageAlt, text, title }) {
  return (
    <div className="project-frame">
      {image && (
        <div className="project-frame-image">
          <img src={image} alt={imageAlt || ''} />
        </div>
      )}
      <div className="project-frame-content">
        {title && <h3 className="project-frame-title">{title}</h3>}
        {text && <p className="project-frame-text">{text}</p>}
      </div>
    </div>
  )
}

export default ProjectFrame

