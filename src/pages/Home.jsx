import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import './Home.css'

function Home() {
  const cheggSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'staffs-ai', label: "STAFF'S AI" },
    { id: 'nav', label: 'NAV' },
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'delight', label: 'DELIGHT' }
  ]

  const owlSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'section-2', label: 'SECTION 2' },
    { id: 'section-3', label: 'SECTION 3' }
  ]

  const quotes = [
    {
      name: 'Todd Cohen',
      bgSrc: '/img/quoters/todd/todd-bg.svg',
      picSrc: '/img/quoters/todd/todd-pic.svg',
      titleSrc: '/img/quoters/todd/todd-title.svg',
      words1Src: '/img/quoters/todd/todd-words.svg',
      characterPosition: 'bottom-left',
      characterOffsetX: 0,
      characterOffsetY: 0,
      bubblePosition: 'right'
    },
    {
      name: 'Andrea Baker',
      bgSrc: '/img/quoters/andrea/andrea-bg.svg',
      picSrc: '/img/quoters/andrea/andrea-pic.svg',
      titleSrc: '/img/quoters/andrea/andrea-title.svg',
      words1Src: '/img/quoters/andrea/andrea-words1.svg',
      words2Src: '/img/quoters/andrea/andrea-words2.svg',
      words3Src: '/img/quoters/andrea/andrea-words3.svg',
      characterPosition: 'bottom-right',
      characterOffsetX: 0,
      characterOffsetY: 0,
      bubblePosition: 'left'
    },
    {
      name: 'Anthony Rezendes',
      bgSrc: '/img/quoters/anthony/anthony-bg.svg',
      picSrc: '/img/quoters/anthony/anthony-pic.svg',
      titleSrc: '/img/quoters/anthony/anthony-title.svg',
      words1Src: '/img/quoters/anthony/anthony-words1.svg',
      words2Src: '/img/quoters/anthony/anthony-words2.svg',
      words3Src: '/img/quoters/anthony/anthony-words3.svg',
      characterPosition: 'bottom-left',
      characterOffsetX: 0,
      characterOffsetY: 0,
      bubblePosition: 'right'
    }
  ]

  return (
    <div className="home-page">
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
      <ProjectRow 
        title="CHEGG'S ADULT LEARNING PLATFORM:" 
        sections={cheggSections}
      />
      {quotes.length > 0 && <QuotesRow quotes={quotes} />}
      <ProjectRow 
        title="Owl case study." 
        sections={owlSections}
      />
    </div>
  )
}

export default Home

