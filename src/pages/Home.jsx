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
            style={{ height: '70%', width: 'auto' }}
          />
        </div>
      )
    }
  ]

  const underConstructionContent = (text, textColor) => (
    <div className="under-construction-panel" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '100%',
      gap: '1rem'
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '18px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 0,
        ...(textColor && { color: textColor })
      }}>
        {text}
      </p>
      <img
        src="/img/me/under-construction.png"
        alt="Under construction"
        style={{ height: '70%', width: 'auto' }}
      />
    </div>
  )

  const foundingSections = [
    {
      id: 'founding',
      label: 'FOUNDING',
      content: (
        <div className="founding-intro-panel">
          <img
            src="/img/8counts/founding-intro.svg"
            alt="Solo-founding forces me to wear all the hats, helping me think holistically about the product and its systems, including branding, marketing and writing, adoption, engagement, monetization, dev/time trade-offs, and support."
          />
        </div>
      )
    },
    {
      id: '8counts',
      label: '8COUNTS',
      background: "url('/img/8counts/8counts-gym-bg-image.svg') 0 0 / auto 100% no-repeat, linear-gradient(270deg, #18365C 57.79%, #030E20 100%), #030E20",
      sectionStyle: { width: 2340, minWidth: 2340 },
      content: (
        <div className="eightcounts-panel">
          <img
            className="eightcounts-header"
            src="/img/8counts/8counts-header.png"
            alt="8counts"
            style={{ height: '96px', width: 'auto' }}
          />
          <div
            className="eightcounts-intro-wrapper"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 148,
              width: 795,
              height: 510,
              overflow: 'hidden',
            }}
          >
            <img
              className="eightcounts-intro"
              src="/img/8counts/8counts-intro.png"
              alt="8counts intro"
              style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'bottom left' }}
            />
          </div>
          <div
            className="eightcounts-screenshots-wrapper"
            style={{
              position: 'absolute',
              left: 920,
              top: '50%',
              transform: 'translateY(-50%)',
              height: '100%',
              maxHeight: 831,
              aspectRatio: '2295/1608',
              overflow: 'hidden',
            }}
          >
            <img
              className="eightcounts-screenshots"
              src="/img/8counts/8counts-screenshots.png"
              alt="8counts screenshots"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      )
    },
    {
      id: 'keyboard',
      label: 'KEYBOARD',
      backgroundColor: '#CED4E0',
      content: underConstructionContent('The HERO Keyboard section is...')
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
        title="Solo-founding"
        sections={foundingSections}
        hiddenTabIds={['founding']}
      />
      {quoteRows.length > 1 && quoteRows[1] && (
        <QuotesRow key={quoteRows[1].id} quotes={quoteRows[1].quotes} />
      )}

      <ProjectRow 
        title="Other projects" 
        sections={[{ id: 'other', label: 'OTHER', content: <OtherProjects /> }]}
        showNavTabs={false}
        className="other-projects-row"
      />
      {quoteRows.length > 2 && quoteRows[2] && (
        <QuotesRow key={quoteRows[2].id} quotes={quoteRows[2].quotes} />
      )}

      <SketchesRow />
      {quoteRows.length > 3 && quoteRows[3] && (
        <QuotesRow key={quoteRows[3].id} quotes={quoteRows[3].quotes} />
      )}
      <MuralsRow />
      
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
