import { useState } from 'react'
import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import SketchesRow from '../components/SketchesRow'
import MuralsRow from '../components/MuralsRow'
import StarrySky from '../components/StarrySky'
import CheggStaffAI from '../components/CheggStaffAI'
import CheggNav from '../components/CheggNav'
import CheggDelight from '../components/CheggDelight'
import OtherProjects from '../components/OtherProjects'
import LearningPanel from '../components/LearningPanel'
import EightcountsVideos from '../components/EightcountsVideos'
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
      id: 'delight',
      label: 'Delight',
      content: <CheggDelight />
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
        loading="lazy"
        style={{ height: '70%', width: 'auto' }}
      />
    </div>
  )

  const eightcountsBackground = "linear-gradient(270deg, #18365C 57.79%, #030E20 100%), #030E20"

  const foundingSections = [
    {
      id: 'founding-intro',
      label: 'FOUNDING',
      content: (
        <div className="founding-intro-panel">
          <img
            src="/img/8counts/founding-intro.svg"
            alt="Solo-founding forces me to wear all the hats, helping me think holistically about the product and its systems, including branding, marketing and writing, adoption, engagement, monetization, dev/time trade-offs, and support."
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: '8counts-intro',
      label: '8COUNTS',
      background: `url('/img/8counts/8counts-gym-bg-image.svg') 0 0 / auto 100% no-repeat, ${eightcountsBackground}`,
      content: (
        <div className="eightcounts-panel eightcounts-panel-intro">
          <img
            className="eightcounts-header"
            src="/img/8counts/8counts-header.png"
            alt="8counts"
            loading="lazy"
          />
          <div className="eightcounts-intro-wrapper">
            <img
              className="eightcounts-intro"
              src="/img/8counts/8counts-intro.png"
              alt="8counts intro"
              loading="lazy"
            />
          </div>
          <div className="eightcounts-screenshots-wrapper">
            <img
              className="eightcounts-screenshots"
              src="/img/8counts/8counts-screenshots.png"
              alt="8counts screenshots"
              loading="lazy"
            />
          </div>
        </div>
      )
    },
    {
      id: '8counts-flow',
      label: '8COUNTS',
      background: eightcountsBackground,
      content: (
        <div className="eightcounts-panel eightcounts-panel-flow">
          <img
            className="eightcounts-flow"
            src="/img/8counts/8counts-pm.png"
            alt="8counts flow"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: '8counts-figma',
      label: '8COUNTS',
      background: eightcountsBackground,
      content: (
        <div className="eightcounts-panel eightcounts-panel-figma">
          <img
            className="eightcounts-me-painting"
            src="/img/8counts/me-painting.svg"
            alt="Me painting"
            loading="lazy"
          />
          <img
            className="eightcounts-figma"
            src="/img/8counts/8counts-figma.png"
            alt="8counts Figma designs"
            loading="lazy"
          />
        </div>
      )
    },
    {
      id: '8counts-videos',
      label: '8COUNTS',
      background: eightcountsBackground,
      content: <EightcountsVideos />
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
        id="chegg"
        title="Chegg Skills:"
        sections={cheggSections}
        color="#F5EFE7"
        backstoryBgColor="#FCC192"
      />
      {quoteRows.length > 0 && quoteRows[0] && (
        <QuotesRow key={quoteRows[0].id} quotes={quoteRows[0].quotes} />
      )}

      <ProjectRow
        id="founding"
        title="Solo-founding"
        sections={foundingSections.filter(s => s.id !== 'keyboard')}
        hiddenTabIds={['founding-intro', '8counts-flow', '8counts-figma', '8counts-videos']}
      />
      {quoteRows.length > 1 && quoteRows[1] && (
        <QuotesRow key={quoteRows[1].id} quotes={quoteRows[1].quotes} />
      )}

      <ProjectRow
        id="other"
        title="Other projects"
        sections={[{ id: 'other-projects', label: 'OTHER', content: <OtherProjects /> }]}
        showNavTabs={false}
        className="other-projects-row"
      />
      {quoteRows.length > 2 && quoteRows[2] && (
        <QuotesRow key={quoteRows[2].id} quotes={quoteRows[2].quotes} />
      )}

      <ProjectRow
        id="learning"
        title="How I'm always learning..."
        sections={[{ id: 'learning-panel', label: 'Learning', content: <LearningPanel /> }]}
        showNavTabs={false}
        className="learning-row"
      />

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
