import { useParams } from 'react-router-dom'
import './ProjectPage.css'

function ProjectPage() {
  const { projectName } = useParams()
  
  // This is a placeholder - project pages will be converted from existing HTML
  // For now, redirect to home or show a placeholder
  return (
    <div className="project-page">
      <section className="project-section">
        <div className="container">
          <h1>Project: {projectName}</h1>
          <p>Project page content will be migrated here from the existing HTML files.</p>
          <p>
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </section>
    </div>
  )
}

export default ProjectPage

