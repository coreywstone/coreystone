import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import SketchesRow from '../components/SketchesRow'
import MuralsRow from '../components/MuralsRow'
import StarrySky from '../components/StarrySky'
import quotesConfig from '../data/quotes.json'
import { getQuoteAssets, getQuoteAlignment, getQuoteLinkedInUrl } from '../utils/quoteData'
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

  const eightCountsSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'section-2', label: 'SECTION 2' },
    { id: 'section-3', label: 'SECTION 3' }
  ]

  const actSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'section-2', label: 'SECTION 2' },
    { id: 'section-3', label: 'SECTION 3' }
  ]

  const heroKeyboardSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'section-2', label: 'SECTION 2' },
    { id: 'section-3', label: 'SECTION 3' }
  ]

  const kleinfelderSections = [
    { id: 'intro', label: 'INTRO' },
    { id: 'section-2', label: 'SECTION 2' },
    { id: 'section-3', label: 'SECTION 3' }
  ]


  // Convert quotes config to quote data structure
  const buildQuotesForRow = (rowConfig) => {
    return rowConfig.quotes.map(name => {
      const assets = getQuoteAssets(name)
      const alignment = getQuoteAlignment(name, rowConfig)
      const linkedInUrl = getQuoteLinkedInUrl(name)
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize name
        ...assets,
        alignment: alignment,
        linkedInUrl: linkedInUrl
      }
    })
  }

  // Build all quote rows from config
  const quoteRows = quotesConfig.rows.map((rowConfig, index) => ({
    id: `quote-row-${index}`,
    quotes: buildQuotesForRow(rowConfig)
  }))

  return (
    <div className="home-page">
      <section className="about-section">
        <StarrySky />
        <div className="alien-planet-bg">
          <img src="/img/bio/alien-planet.svg" alt="Surface of a random planet." />
        </div>
        <div className="container">
          <div className="about-content">
            <div className="about-image">
              <img 
                src="/img/me/corey-arms-at-side.svg" 
                alt="Corey Stone"
                className="profile-image"
              />
            </div>
            <div className="about-text">
              <p className="introtext">
                👋 Hello! I'm Corey, an action-biased ambiguity-loving Super-IC Product Designer 
                and dad of 4 kids and many animals (<a href="https://coreystone.com/bio/">see bio</a> for dog pic).
               I don't really look like this, because the C on my chest stands for 🍪.
              </p>
              <p className="introtext">
                I'm also a 0-1 thinker with experience at 4 startups plus solo-founding 7 apps, 
                so I tend to work with a first-principles approach and founder's mindset. 
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
        title="Chegg Skills:" 
        sections={cheggSections}
        color="#F5EFE7"
      />
      {quoteRows.length > 0 && quoteRows[0] && (
        <QuotesRow key={quoteRows[0].id} quotes={quoteRows[0].quotes} />
      )}

      <ProjectRow 
        title="Owl Health:" 
        sections={owlSections}
        color="#F5EFE7"
      />
      {quoteRows.length > 2 && quoteRows[2] && (
        <QuotesRow key={quoteRows[2].id} quotes={quoteRows[2].quotes} />
      )}

      <ProjectRow 
        title="Founding 8counts:" 
        sections={eightCountsSections}
        color="#F5EFE7"
      />
      {quoteRows.length > 3 && quoteRows[3] && (
        <QuotesRow key={quoteRows[3].id} quotes={quoteRows[3].quotes} />
      )}

      <ProjectRow 
        title="ACT:" 
        sections={actSections}
      />
      {quoteRows.length > 4 && quoteRows[4] && (
        <QuotesRow key={quoteRows[4].id} quotes={quoteRows[4].quotes} />
      )}

      <ProjectRow 
        title="Founding HERO Keyboard:" 
        sections={heroKeyboardSections}
      />
      {quoteRows.length > 5 && quoteRows[5] && (
        <QuotesRow key={quoteRows[5].id} quotes={quoteRows[5].quotes} />
      )}

      <ProjectRow 
        title="Kleinfelder:" 
        sections={kleinfelderSections}
      />
      {quoteRows.length > 6 && quoteRows[6] && (
        <QuotesRow key={quoteRows[6].id} quotes={quoteRows[6].quotes} />
      )}

      <SketchesRow />
      <MuralsRow />
    </div>
  )
}

export default Home
