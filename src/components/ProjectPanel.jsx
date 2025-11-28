import './ProjectPanel.css'

function ProjectPanel({ children, title }) {
  return (
    <section className="project-panel">
      {title && (
        <h2 className="project-panel-title">{title}</h2>
      )}
      <div className="project-panel-container">
        <div className="project-panel-scroll">
          {children || (
            <div className="project-panel-placeholder">
              <p>Project content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProjectPanel

