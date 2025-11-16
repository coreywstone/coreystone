import IntroSection from '../components/IntroSection'
import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import './Home.css'

function Home() {
  // Placeholder data - will be replaced with actual content
  const projectFrames = [
    // Add project frames here when content is ready
  ]

  const quotes = [
    // Add quotes here when content is ready
  ]

  return (
    <div className="home-page">
      <IntroSection />
      {projectFrames.length > 0 && <ProjectRow frames={projectFrames} />}
      {quotes.length > 0 && <QuotesRow quotes={quotes} />}
      
      {/* Temporary: Keep existing content structure for now */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img 
                src="/img/CoreyStone-sq2022.jpg" 
                alt="Photo of Corey Stone"
                className="profile-image"
              />
            </div>
            <div className="about-text">
              <p className="introtext">
                👋 Hello! I'm Corey, an action-biased ambiguity-loving Super-IC Product Designer 
                and dad of four kids and many animals (<a href="/bio">see bio</a> for dog pic).
              </p>
              <p className="introtext">
                I'm also a 0-1 thinker with experience at 4 startups plus solo-founding 7 apps, 
                so I tend to work with a founder's mindset and first-principles problem solving. 
                See my work below or grab my{' '}
                <a href="/Corey-Stone-Resume.pdf" target="_blank" rel="noopener noreferrer">
                  résumé <i className="fa fa-file-pdf-o"></i>
                </a>{' '}
                if you need it. Thanks! <i className="fa fa-smile-o"></i>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

