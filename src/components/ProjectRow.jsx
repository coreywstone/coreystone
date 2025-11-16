import ProjectFrame from './ProjectFrame'
import './ProjectRow.css'

function ProjectRow({ frames = [] }) {
  return (
    <section className="project-row">
      <div className="project-row-container">
        <div className="project-row-scroll">
          {frames.length > 0 ? (
            frames.map((frame, index) => (
              <ProjectFrame
                key={index}
                image={frame.image}
                imageAlt={frame.imageAlt}
                text={frame.text}
                title={frame.title}
              />
            ))
          ) : (
            <div className="project-row-placeholder">
              <p>Project frames will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProjectRow

