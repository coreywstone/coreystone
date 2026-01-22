import { useState } from 'react'
import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import SketchesRow from '../components/SketchesRow'
import MuralsRow from '../components/MuralsRow'
import StarrySky from '../components/StarrySky'
import CheggStaffAI from '../components/CheggStaffAI'
import CheggNav from '../components/CheggNav'
import OtherProjects from '../components/OtherProjects'
import quotesConfig from '../data/quotes.json'
import { getQuoteAssets, getQuoteAlignment, getQuoteLinkedInUrl } from '../utils/quoteData'
import './Home.css'

function Home() {
  const [phogImage, setPhogImage] = useState('/img/me/phog-lying-on-side.png')

  const handlePhogClick = () => {
    const audio = new Audio('/img/me/phog-meow.mp3')
    audio.play().catch(err => {
      console.error('Error playing cat sound:', err)
    })
    
    // Swap to poked image
    setPhogImage('/img/me/phog-lying-on-side-poked.png')
    
    // Return to original image after brief pause
    setTimeout(() => {
      setPhogImage('/img/me/phog-lying-on-side.png')
    }, 500)
  }

  const cheggSections = [
    { 
      id: 'staffs-ai', 
      label: "STAFF'S AI",
      content: <CheggStaffAI />
    },
    { 
      id: 'nav', 
      label: 'NAV',
      content: <CheggNav />
    },
    { 
      id: 'dashboard', 
      label: 'DASHBOARD',
      backgroundColor: '#CED4E0', // Marble
      content: (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%', 
          width: '100%', 
          gap: '1rem' 
        }}>
          <p style={{ 
            fontFamily: 'var(--font-anime-ace)', 
            fontSize: '18px', 
            fontWeight: 'bold', 
            textAlign: 'center',
            margin: 0
          }}>
            The Dashboard section is...
          </p>
          <img 
            src="/img/me/under-construction.png" 
            alt="Under construction" 
            style={{ width: '540px', height: 'auto' }}
          />
        </div>
      )
    }
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
            <div className="about-image-group">
              <div className="about-image">
                <img 
                  src="/img/me/corey-arms-at-side.svg" 
                  alt="Corey Stone"
                  className="profile-image"
                />
                <img 
                  src="/img/me/intro-words.svg" 
                  alt="Intro text"
                  className="intro-words"
                />
              </div>
              <img 
                src={phogImage}
                alt="Phog the cat"
                className="phog-image"
                onClick={handlePhogClick}
              />
            </div>
          </div>
        </div>
      </section>

      <ProjectRow 
        title="Chegg Skills:" 
        sections={cheggSections}
        color="#F5EFE7"
        backstoryBgColor="#FCC192"
      />
      {quoteRows.length > 0 && quoteRows[0] && (
        <QuotesRow key={quoteRows[0].id} quotes={quoteRows[0].quotes} />
      )}

      <ProjectRow 
        title="Other projects" 
        sections={[{ id: 'other', label: 'OTHER', content: <OtherProjects /> }]}
        showNavTabs={false}
        className="other-projects-row"
      />
      {quoteRows.length > 1 && quoteRows[1] && (
        <QuotesRow key={quoteRows[1].id} quotes={quoteRows[1].quotes} />
      )}

      <SketchesRow />
      {quoteRows.length > 2 && quoteRows[2] && (
        <QuotesRow key={quoteRows[2].id} quotes={quoteRows[2].quotes} />
      )}
      <MuralsRow />
      
      {quoteRows.length > 3 && quoteRows[3] && (
        <QuotesRow key={quoteRows[3].id} quotes={quoteRows[3].quotes} />
      )}
      {quoteRows.length > 4 && quoteRows[4] && (
        <QuotesRow key={quoteRows[4].id} quotes={quoteRows[4].quotes} />
      )}
      {quoteRows.length > 5 && quoteRows[5] && (
        <QuotesRow key={quoteRows[5].id} quotes={quoteRows[5].quotes} />
      )}
      {quoteRows.length > 6 && quoteRows[6] && (
        <QuotesRow key={quoteRows[6].id} quotes={quoteRows[6].quotes} />
      )}
    </div>
  )
}

export default Home
