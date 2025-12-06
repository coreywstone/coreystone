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
            <h3 className="textbox-image-pair-title">KID'S ROOM MURALS</h3>
            <p className="textbox-image-pair-text">EVERYONE PAINTS FLOOR-TO-CEILING MURALS ON THEIR KIDS' ROOMS, RIGHT? NO? HMMM. SINCE WE MOVED A COUPLE TIMES, I ENDED UP FREE-HAND PAINTING 4 ROOMS – HERE'S TWO:</p>
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
      id: 'scooters', 
      label: 'SCOOTERS',
      content: (
        <TextboxImagePair
          title="SCOOTER CONCEPTS"
          text="I ALMOST DID SOME FREELANCE WORK FOR A SCOOTER STARTUP, AND THESE WERE A FEW QUICK PRELIMINARY IDEAS TO SOLVE THE PROBLEMS OF RIDER SAFETY, BRANDING IN A COMPETITIVE MARKET, AND CITY BANS DUE TO PEOPLE LEAVING SCOOTERS IN THE MIDDLE OF SIDEWALKS."
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
          title="PEANUT BUTTER JAR LID + KNIFE"
          text="PRETTY SELF-EXPLANATORY. THIS SHOULD REALLY HAPPEN."
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
          title="COLLAPSIBLE SNOWBOARD POLES"
          text="I'M A SKIER, BUT THE ONE TIME I SNOWBOARDED, I THOUGHT OF THIS TO HELP SNOWBOARDERS GET THROUGH FLATS AND LIFT LINES."
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
          title='"SPORT LEAD" DOG LEASH'
          text="OUR FIRST DOG (JUNE) DID SOME DOG SPORTS LIKE FRISBEE AND FLYBALL, WHICH MEANS YOU'RE OFTEN TAKING YOUR DOG ON AND OFF THE LEASH (AND HOLDING THE LEASH WHEN NOT USING IT). 'THERE MUST BE A BETTER WAY!' I THOUGHT, SO I DESIGNED A RETRACTABLE COLLAR-MOUNTED LEASH. UPDATE: SOMEBODY ENDED UP MAKING THESE!"
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
          title="BABY SWADDLE"
          text="WHEN WE HAD OUR FIRST BABY, THE USUAL PARENTING STRUGGLES GAVE ME QUITE A FEW IDEAS! OUR FIRST HAD COLIC (IE, CRIES ALL THE TIME), AND THE 'HAPPIEST BABY ON THE BLOCK' BOOK TAUGHT US THAT SWADDLING CHRISTOPHER SHOULD HELP. PROBLEM WAS, BABIES WRIGGLE OUT OF A SWADDLED BLANKET, SO I DESIGNED A SIMPLE VELCRO-BASED 'COOL SWADDLE' (BASICALLY A BABY STRAIGHT JACKET), WHICH WORKED GREAT. SADLY, I NEVER GOT THE PRODUCT TO MARKET, AND EVENTUALLY SOMEONE ELSE DID (IT'S ON THE STORES AT WALMART NOW)...SIGH. IT'S ONE OF MY BIGGER REGRETS."
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
          title="CRIB-LIFT"
          text="MY SMALL POST-PREGNANT WIFE STRUGGLED TO LIFT THE BABY IN AND OUT OF THE CRIB, AND DROP-SIDE CRIBS DON'T SEEM TO WORK THAT WELL (AND STILL REQUIRE YOU TO BEND OVER), SO I CAME UP WITH THIS FAIRLY SIMPLE PUSH-PEDAL IDEA TO EASILY RAISE THE MATTRESS."
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
          title="COMFY HIGH HEELS"
          text="A HALF-BAKED IDEA TO MAKE HEELS LESS PAINFUL. I HAVE NO IDEA HOW WOMEN WEAR THEM ALL DAY. REALLY GLAD I WORK FROM HOME IN SLIPPERS. 😁"
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
          title="BASKETBALL REF'S FOUL TRACKER"
          text="EVER NOTICE HOW BASKETBALL REFS HAVE TO RUN TO THE SCORER'S TABLE TO SIGNAL WHO THE FOUL WAS ON? WHY NOT JUST HAVE A WRISTBAND-MOUNTED TOOL WHERE THEY CAN EASILY ENTER IT?"
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
          title="MOUSE WITH TACTILE OUTPUT"
          text="I HAD THIS IDEA WHILE I WAS IN GRAD SCHOOL FOR BIOMECHANICS / ERGONOMICS. I DON'T THINK IT'S BEEN DONE, WHICH OF COURSE MIGHT MEAN IT'S A BAD IDEA."
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
          title="CAR HAIL COVER"
          text="THIS IDEA CAME TO ME WHEN WE LIVED IN STORMY IOWA WITH TWO CARS AND A ONE-CAR GARAGE."
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
          title="DISPOSABLE CAR CORNER-BUMPERS"
          text="WHEN MY WIFE AND I VISITED TAIWAN, I NOTICED THAT MOST CARS HAD MINOR DAMAGE ON THEIR CORNER BUMPERS, SO..."
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
          title="PERISCOPE BASEMENT WINDOWS"
          text="NEED A WINDOW IN A FULLY UNDERGROUND BASEMENT? I DO!"
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
          title="PORTABLE PAPER-BOOK READER"
          text="WE HAVE AUDIOBOOKS, BUT WOULDN'T IT BE NICE TO HAVE PAPER BOOKS READ TO US?"
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
