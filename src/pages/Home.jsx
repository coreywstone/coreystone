import ProjectRow from '../components/ProjectRow'
import QuotesRow from '../components/QuotesRow'
import TextboxImagePair from '../components/TextboxImagePair'
import quotesConfig from '../data/quotes.json'
import { getQuoteAssets, getQuoteAlignment } from '../utils/quoteData'
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

  const sketchesMuralsSections = [
    { 
      id: 'murals', 
      label: 'MURALS',
      content: (
        <div className="textbox-image-pair">
          <div className="textbox-image-pair-textbox">
            <h3 className="textbox-image-pair-title">Kid's room murals</h3>
            <p className="textbox-image-pair-text">Everyone paints floor-to-ceiling murals on their kids' rooms, right? No? Hmmm. Since we moved a couple times, I ended up free-hand painting 4 rooms – here's two:</p>
          </div>
          <div className="textbox-image-pair-image-container" style={{ flexDirection: 'row', gap: '32px', padding: '0 32px 0 0' }}>
            <img 
              src="/img/murals/nemo-panorama.jpg" 
              alt="Eli's Nemo painted mural room"
              style={{ width: 'auto', height: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
            <img 
              src="/img/murals/CT-room-murals.jpg" 
              alt="Christopher's Tarzan/Jungle Book painted mural room"
              style={{ width: 'auto', height: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)' }}
            />
          </div>
        </div>
      )
    },
    { 
      id: 'intro', 
      label: 'INTRO',
      content: (
        <div className="textbox-image-pair">
          <div className="textbox-image-pair-textbox" style={{ width: '100%', maxWidth: '600px' }}>
            <p className="textbox-image-pair-text" style={{ margin: 0 }}>
              I like to solve my life's little annoyances, at least theoretically. Sometimes I actually make them into products (I'm working on some new ones now), but the ideas at right languish in my sketchbook graveyard. Many are non-digital products (remember I'm an Industrial Design grad) but hopefully they shed some light on how I think.
            </p>
          </div>
        </div>
      )
    },
    { 
      id: 'scooters', 
      label: 'SCOOTERS',
      content: (
        <TextboxImagePair
          title="Scooter concepts"
          text="I almost did some freelance work for a scooter startup, and these were a few quick preliminary ideas to solve the problems of rider safety, branding in a competitive market, and city bans due to people leaving scooters in the middle of sidewalks."
          image="/img/sketches/scooters.jpg"
          imageAlt="Scooter concept sketches"
        />
      )
    },
    { 
      id: 'peanut-butter', 
      label: 'PB-KNIFE',
      content: (
        <TextboxImagePair
          title="Peanut butter jar lid + knife"
          text="Pretty self-explanatory. This should really happen."
          image="/img/sketches/peanut-butter.jpg"
          imageAlt="Peanut butter jar lid with integrated knife sketch"
        />
      )
    },
    { 
      id: 'snowboard-poles', 
      label: 'POLES',
      content: (
        <TextboxImagePair
          title="Collapsible snowboard poles"
          text="I'm a skier, but the one time I snowboarded, I thought of this to help snowboarders get through flats and lift lines."
          image="/img/sketches/snowboard-poles.jpg"
          imageAlt="Collapsible snowboard poles sketch"
        />
      )
    },
    { 
      id: 'sport-lead', 
      label: 'LEASH',
      content: (
        <TextboxImagePair
          title='"Sport Lead" dog leash'
          text="Our first dog (June) did some dog sports like frisbee and flyball, which means you're often taking your dog on and off the leash (and holding the leash when not using it). 'There must be a better way!' I thought, so I designed a retractable collar-mounted leash. Update: Somebody ended up making these!"
          image="/img/sketches/sport-lead.jpg"
          imageAlt="Collar-mounted retractable dog leash sketch"
        />
      )
    },
    { 
      id: 'swaddle', 
      label: 'SWADDLE',
      content: (
        <TextboxImagePair
          title="Baby swaddle"
          text="When we had our first baby, the usual parenting struggles gave me quite a few ideas! Our first had colic (ie, cries all the time), and the 'Happiest Baby on the Block' book taught us that swaddling Christopher should help. Problem was, babies wriggle out of a swaddled blanket, so I designed a simple velcro-based 'Cool Swaddle' (basically a baby straight jacket), which worked great. Sadly, I never got the product to market, and eventually someone else did (it's on the stores at Walmart now)...sigh. It's one of my bigger regrets."
          image="/img/sketches/swaddle.jpg"
          imageAlt="Baby swaddle sketch"
        />
      )
    },
    { 
      id: 'crib-lift', 
      label: 'CRIB',
      content: (
        <TextboxImagePair
          title="Crib-lift"
          text="My small post-pregnant wife struggled to lift the baby in and out of the crib, and drop-side cribs don't seem to work that well (and still require you to bend over), so I came up with this fairly simple push-pedal idea to easily raise the mattress."
          image="/img/sketches/crib-lift.jpg"
          imageAlt="Crib-lift sketch"
        />
      )
    },
    { 
      id: 'heels', 
      label: 'HEELS',
      content: (
        <TextboxImagePair
          title="Comfy high heels"
          text="A half-baked idea to make heels less painful. I have no idea how women wear them all day. Really glad I work from home in slippers. 😁"
          image="/img/sketches/heels.jpg"
          imageAlt="Comfortable high heels sketch"
        />
      )
    },
    { 
      id: 'basketball-ref', 
      label: 'REF',
      content: (
        <TextboxImagePair
          title="Basketball ref's foul tracker"
          text="Ever notice how basketball refs have to run to the scorer's table to signal who the foul was on? Why not just have a wristband-mounted tool where they can easily enter it?"
          image="/img/sketches/basketball-ref-tool.jpg"
          imageAlt="Basketball referee foul tracker sketch"
        />
      )
    },
    { 
      id: 'tactile-mouse', 
      label: 'MOUSE',
      content: (
        <TextboxImagePair
          title="Mouse with tactile output"
          text="I had this idea while I was in grad school for Biomechanics / Ergonomics. I don't think it's been done, which of course might mean it's a bad idea."
          image="/img/sketches/tactile-mouse.jpg"
          imageAlt="Tactile mouse concept sketch"
        />
      )
    },
    { 
      id: 'hail-cover', 
      label: 'HAIL',
      content: (
        <TextboxImagePair
          title="Car hail cover"
          text="This idea came to me when we lived in stormy Iowa with two cars and a one-car garage."
          image="/img/sketches/hail-cover.jpg"
          imageAlt="Car hail cover sketch"
        />
      )
    },
    { 
      id: 'disposable-bumpers', 
      label: 'BUMPERS',
      content: (
        <TextboxImagePair
          title="Disposable car corner-bumpers"
          text="When my wife and I visited Taiwan, I noticed that most cars had minor damage on their corner bumpers, so..."
          image="/img/sketches/disposable-bumpers.jpg"
          imageAlt="Disposable car bumpers sketch"
        />
      )
    },
    { 
      id: 'periscope-windows', 
      label: 'PERISCOPE',
      content: (
        <TextboxImagePair
          title="Periscope basement windows"
          text="Need a window in a fully underground basement? I do!"
          image="/img/sketches/periscope-windows.jpg"
          imageAlt="Periscope basement windows sketch"
        />
      )
    },
    { 
      id: 'audio-reader', 
      label: 'A-BOOK',
      content: (
        <TextboxImagePair
          title="Portable paper-book reader"
          text="We have audiobooks, but wouldn't it be nice to have paper books read to us?"
          image="/img/sketches/audio-reader.jpg"
          imageAlt="Portable paper-book reader sketch"
        />
      )
    }
  ]

  // Convert quotes config to quote data structure
  const buildQuotesForRow = (rowConfig) => {
    return rowConfig.quotes.map(name => {
      const assets = getQuoteAssets(name)
      const alignment = getQuoteAlignment(name, rowConfig)
      
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize name
        ...assets,
        alignment: alignment
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
                and dad of 4 kids and many animals (<a href="https://coreystone.com/bio/">see bio</a> for dog pic).
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
        title="Chegg Skills:" 
        sections={cheggSections}
        color="#EB7100"
      />
      {quoteRows.length > 0 && quoteRows[0] && (
        <QuotesRow key={quoteRows[0].id} quotes={quoteRows[0].quotes} />
      )}

      <ProjectRow 
        title="Owl Health:" 
        sections={owlSections}
        color="#52E2D4"
      />
      {quoteRows.length > 2 && quoteRows[2] && (
        <QuotesRow key={quoteRows[2].id} quotes={quoteRows[2].quotes} />
      )}

      <ProjectRow 
        title="Founding 8counts:" 
        sections={eightCountsSections}
        color="#FF2A8D"
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

      <ProjectRow 
        title="Murals & Sketches" 
        sections={sketchesMuralsSections}
        color="#F5EFE7"
        showNavTabs={false}
        backgroundColor="#FFFFFF"
      />
    </div>
  )
}

export default Home
