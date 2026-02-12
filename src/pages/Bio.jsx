import './Bio.css'

function Bio() {
  return (
    <div className="bio-page">
      <section className="bio-section">
        <div className="container">
          <h1 className="bio-title">So you wanna know about me?</h1>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                I was born in the 70s, my dad a tweed-jacketed Business professor and mom a writer, 
                musician, PFLAG chapter founder, and later got a Counseling degree, but sadly passed 
                away in 2000 before she could use it.
              </p>
              <p>
                Farther back, my family includes a renowned{' '}
                <a href="https://en.wikipedia.org/wiki/William_P._Bidelman" target="_blank" rel="noopener noreferrer">
                  Harvard astronomer
                </a>{' '}
                🌌, painter 🎨,{' '}
                <a href="https://en.wikipedia.org/wiki/Joseph_Bell_DeRemer" target="_blank" rel="noopener noreferrer">
                  architect
                </a>{' '}
                🏛️, and teachers 🧑‍🏫.
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(-2deg)' }}>
                <img src="/img/bio/mom-and-dad.jpg" alt="An old photo of my mom, dad, and brother." loading="lazy" />
                <p>My brother's expression FTW!</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                Although we had no designers in the family, my parents had some sweet Danish teak 
                furniture – maybe an early design influence on me? 🤔
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(1deg)' }}>
                <img src="/img/bio/baby-blue-chair.jpg" alt="Me in our cool blue chair." loading="lazy" />
                <p>Ignore the baby; admire the timeless chair design!</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                Growing up in Iowa City, I did lots of drawing, painting, backyard football, 
                gymnastics, skateboarding, and biking.
              </p>
              <p>
                We'd jump in the huge city leaf pile 🍂 and make snow forts and tunnels in our 
                cul-de-sac where the plows pushed all the snow. ☃️
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(3deg)' }}>
                <img src="/img/bio/me-in-a-pipe.jpg" alt="Me as a kid, standing in a pipe for some reason." loading="lazy" />
                <p>Hopefully not a sewage pipe.</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                My{' '}
                <a href="https://www.imdb.com/name/nm0831780/?ref_=ext_shr_lnk" target="_blank" rel="noopener noreferrer">
                  brother
                </a>{' '}
                (now a sound engineer for movies – he did Frozen!) was the real computer wiz, but I 
                used MacDraw to draft putt-putt holes ⛳️ and skate ramps 🛹 to build. I'd spec out 
                the parts list and call for lumber prices. We built 2 ramps and no golf holes, but no 
                one ever told me, "Hey Corey, you're a designer!"
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(-2deg)' }}>
                <img src="/img/bio/old-mac.jpg" alt="Our second computer." loading="lazy" />
                <p>My childhood Mac Plus.</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                We moved to Oklahoma in 10th grade, where I did gymnastics and played a lot of sand 
                volleyball and cards with friends. Academically, I did well in both creative and STEM, 
                but I wanted to do something art-related.
              </p>
              <p>
                My art teacher recommended the University of Kansas' Fine Arts program, and after 
                filling out the long paper application, I decided I didn't want to do that again, so 
                I went to KU. 💙❤️
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(4deg)', maxWidth: '380px' }}>
                <img src="/img/bio/high-school-yearbook.jpg" alt="Boring high school yearbook photo." loading="lazy" />
                <p>I can't find any fun high school photos. 😞</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>I majored in Industrial Design at KU, where the main design professors' approaches were:</p>
              <ul>
                <li>
                  <a href="https://arcd.ku.edu/news/article/2020/02/26/remembering-design-professor-emeritus-richard-branham-alumnus-david-w-hill" target="_blank" rel="noopener noreferrer">
                    Richard Branham
                  </a>{' '}
                  was very <strong>user-focused and process-oriented.</strong>
                </li>
                <li>
                  <a href="https://www.idsa.org/profile/ronald-b-kemnitzer/" target="_blank" rel="noopener noreferrer">
                    Ron Kemnitzer
                  </a>{' '}
                  was more market-driven:{' '}
                  <strong>"What are the benefits and why would someone buy this?"</strong>
                </li>
                <li>
                  <a href="https://www.idsa.org/profile/lance-rake/" target="_blank" rel="noopener noreferrer">
                    Lance Rake
                  </a>{' '}
                  stressed the <strong>coolness and uniqueness</strong> of the form and solution.
                </li>
              </ul>
              <p>
                Overall, the design-thinking user-centered ID process was perfect prep for digital 
                product design and UX work.
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(-1deg)' }}>
                <img src="/img/bio/cheer-front-flip.jpg" alt="Newspaper photo of little Greg and me front-flipping over some people while cheerleading at a KU football game." loading="lazy" />
                <p>I also cheered at KU – that's Greg and me flipping over girls. Our record was 8, and we never landed on any! 😅</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>After KU, we got married and moved to Iowa City for grad school at the U. of Iowa. 🖤💛</p>
              <p>
                Despite my design professor telling me I should get my master's in Cognitive Science, 
                I got it in Ergonomics / Biomechanics to improve my ability to design physical products. 
                Turns out he was right. He was always right. ¯\_(ツ)_/¯
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(2deg)' }}>
                <img src="/img/bio/wedding.jpg" alt="Wedding photo." loading="lazy" />
                <p></p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>After grad school and working a few years in Iowa, we moved back to Kansas to populate the earth. 👦</p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(-2deg)' }}>
                <img src="/img/bio/family-in-big-chair.jpg" alt="The whole family in the big wooden chair at Silver Dollar City." loading="lazy" />
                <p>In the big wooden chair at Silver Dollar City, 2015ish.</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                In the evenings, Nami and I also coached KU cheer from 2004-2015. At first, I listened 
                to a bunch of leadership books on my Cerner commute, which helped me create motivational 
                systems and a culture of excellence. Might have lost some hearing from Allen Fieldhouse though. 🏀🙉
              </p>
              <p>
                My cheer knowledge also inspired many of the apps and services I founded, including the 
                newest one I'm working on now with a dev partner.
              </p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(3deg)' }}>
                <img src="/img/bio/cheer-nationals-trophy.jpg" alt="The whole family in the big wooden chair at Silver Dollar City." loading="lazy" />
                <p>4th at UCA nationals in the toughest division. 🙌</p>
              </div>
            </div>
          </div>

          <div className="bio-row">
            <div className="bio-text">
              <p>
                That pretty much brings us to today. The kids are in high school and college, and 
                somehow we currently have 4 dogs (technically, two are/were our older two kids' ESA 
                dogs, but you know how that goes 😔).
              </p>
              <p>Meanwhile, I'm still designing full-time, working on side projects, and always learning something new. 💡</p>
            </div>
            <div className="bio-image">
              <div className="polaroid" style={{ transform: 'rotate(-1deg)' }}>
                <img src="/img/bio/dogs.jpg" alt="Our four dogs in a dogpile." loading="lazy" />
                <p>Too many dogs! By head, from left: Ghost, Namor,<br />Jamie Lee Curtis, and Frazier. 🐕</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Bio

