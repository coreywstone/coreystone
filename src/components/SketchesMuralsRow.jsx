import { useEffect, useRef, useState } from 'react'
import SketchesMuralsNav from './SketchesMuralsNav'
import SketchesMuralsSection from './SketchesMuralsSection'
import TextboxImagePair from './TextboxImagePair'
import './SketchesMuralsRow.css'
import './TextboxImagePair.css'

function SketchesMuralsRow() {
  const sketchesMuralsSections = [
    { 
      id: 'murals', 
      label: 'MURALS',
      content: (
        <div className="textbox-image-pair">
          <div className="textbox-image-pair-textbox" style={{ paddingLeft: 0 }}>
            <h3 className="textbox-image-pair-title">Kid's room murals</h3>
            <p className="textbox-image-pair-text">Everyone paints floor-to-ceiling murals on their kids' rooms, right? No? Hmmm. Since we moved a couple times, I ended up free-hand painting 4 rooms – here's two:</p>
          </div>
          <div className="textbox-image-pair-image-container" style={{ flexDirection: 'row', gap: '32px', padding: '0 32px 0 0' }}>
            <img 
              src="/img/murals/nemo-panorama-upscaled.jpg" 
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
          <div className="textbox-image-pair-textbox" style={{ width: '100%', maxWidth: '600px', paddingLeft: 0 }}>
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

  const [activeSectionId, setActiveSectionId] = useState(sketchesMuralsSections[0]?.id || null)
  const [isNavSticky, setIsNavSticky] = useState(false)
  const scrollContainerRef = useRef(null)
  const sectionRefs = useRef([])
  const rowRef = useRef(null)

  // Background color mapping for specific panels
  const getBackgroundColor = (sectionId, index) => {
    // First panel (murals) = Blackish
    if (index === 0) return "#262629"
    
    // Second panel (intro) = Blackish
    if (index === 1) return "#262629"
    
    // Scooter = Marble
    if (sectionId === 'scooters') return "#CED4E0"
    
    // Cream panels
    const creamPanels = ['sport-lead', 'swaddle', 'crib-lift']
    if (creamPanels.includes(sectionId)) return "#F5EFE7"
    
    // Beige panels
    const beigePanels = ['peanut-butter', 'snowboard-poles', 'hail-cover', 'periscope-windows']
    if (beigePanels.includes(sectionId)) return "#D4B5A0"
    
    // Default to Marble for all other panels
    return "#CED4E0"
  }

  // Set up IntersectionObserver to detect when SketchesMuralsRow is in view (for sticky nav)
  useEffect(() => {
    if (!rowRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsNavSticky(entry.isIntersecting)
        })
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    )

    observer.observe(rowRef.current)

    return () => {
      if (rowRef.current) {
        observer.unobserve(rowRef.current)
      }
    }
  }, [])

  // Set up IntersectionObserver to detect which section is in view
  useEffect(() => {
    if (sketchesMuralsSections.length === 0 || !scrollContainerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setActiveSectionId(entry.target.id)
          }
        })
      },
      {
        root: scrollContainerRef.current,
        threshold: [0, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '0px'
      }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [sketchesMuralsSections])

  // Also listen to scroll events for more responsive updates
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const containerLeft = containerRect.left
      const containerWidth = containerRect.width
      const containerCenter = containerLeft + containerWidth / 2

      let closestSection = null
      let closestDistance = Infinity

      sectionRefs.current.forEach((ref) => {
        if (!ref) return
        const sectionRect = ref.getBoundingClientRect()
        const sectionCenter = sectionRect.left + sectionRect.width / 2
        const distance = Math.abs(sectionCenter - containerCenter)
        const visibilityRatio = Math.min(
          (sectionRect.right - containerLeft) / containerWidth,
          (containerLeft + containerWidth - sectionRect.left) / containerWidth
        )

        if (visibilityRatio >= 0.5 && distance < closestDistance) {
          closestDistance = distance
          closestSection = ref.id
        }
      })

      if (closestSection) {
        setActiveSectionId(closestSection)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [sketchesMuralsSections])

  const handleTabClick = (sectionId, index) => {
    const sectionRef = sectionRefs.current[index]
    if (sectionRef && scrollContainerRef.current) {
      sectionRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      })
      setActiveSectionId(sectionId)
    }
  }

  const handleTitleClick = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section ref={rowRef} className="sketches-murals-row">
      <SketchesMuralsNav
        title="Murals & Sketches"
        sections={sketchesMuralsSections}
        activeSectionId={activeSectionId}
        onTabClick={handleTabClick}
        scrollContainerRef={scrollContainerRef}
        isSticky={isNavSticky}
        color="#F5EFE7"
        showTabs={false}
        onTitleClick={handleTitleClick}
      />
      <div ref={scrollContainerRef} className="sketches-murals-panel-container">
        <div className="sketches-murals-panel-scroll">
          {sketchesMuralsSections.length > 0 ? (
            sketchesMuralsSections.map((section, index) => (
              <SketchesMuralsSection
                key={section.id}
                ref={el => sectionRefs.current[index] = el}
                id={section.id}
                isLast={index === sketchesMuralsSections.length - 1}
                backgroundColor={getBackgroundColor(section.id, index)}
              >
                {section.content || (
                  <div className="sketches-murals-section-placeholder">
                    <p>[ Section {index + 1}: {section.label} ]</p>
                  </div>
                )}
              </SketchesMuralsSection>
            ))
          ) : (
            <div className="sketches-murals-panel-placeholder">
              <p>Project content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SketchesMuralsRow
