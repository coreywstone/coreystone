import './CheggDelight.css'

function CheggDelight() {
  return (
    <div className="chegg-delight-panel">
      {/* Panel 1: Problem */}
      <div className="chegg-delight-problem">
        <img src="/img/chegg/chegg-delight-problem.jpg" alt="Delight problem" />
      </div>

      {/* Panel 2: Thinking */}
      <div className="chegg-delight-thinking">
        <img src="/img/chegg/chegg-delight-thinking.jpg" alt="Delight thinking" />
      </div>

      {/* Panel 3: Presentation */}
      <div className="chegg-delight-presentation">
        <img
          className="chegg-delight-me"
          src="/img/me/me-presenting-to-right.svg"
          alt=""
        />
        <div className="chegg-delight-dashboards-container">
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              Iterating on journey-based dashboards:
            </h3>
            <div className="chegg-delight-dashboard-wrapper chegg-delight-dashboard-wrapper--iterations">
              <img
                className="chegg-delight-dashboard chegg-delight-dashboard--iterations"
                src="/img/chegg/chegg-dashboard-iterations.png"
                alt="Dashboard iterations"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              My new hyper-personalized coach-focused dashboard:
            </h3>
            <div className="chegg-delight-dashboard-wrapper">
              <img
                className="chegg-delight-dashboard"
                src="/img/chegg/chegg-dashboard-light.png"
                alt="Chegg dashboard"
              />
            </div>
          </div>
          <div className="chegg-delight-dashboard-stack">
            <h3 className="chegg-delight-dashboard-title">
              For the ikea effect, dark mode & unsplash options:
            </h3>
            <div className="chegg-delight-dashboard-wrapper">
              <img
                className="chegg-delight-dashboard"
                src="/img/chegg/chegg-dashboard-dark.jpg"
                alt="Chegg dashboard dark mode"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Panel 4: Confetti */}
      <div className="chegg-delight-confetti">
        <iframe
          src="/files/confetti.html"
          title="Confetti animation"
          className="chegg-delight-confetti-iframe"
        />
      </div>

      {/* Panel 5: Lo-fi */}
      <div className="chegg-delight-lofi">
        <div className="chegg-delight-lofi-left">
          <p className="chegg-delight-lofi-text">
            To further help learners, I added lo-fi study music and a 'Today' micro-display.
          </p>
        </div>
        <div className="chegg-delight-lofi-right">
          <img
            className="chegg-delight-lofi-img"
            src="/img/chegg/chegg-delight-lo-fi.png"
            alt="Lo-fi study music and Today micro-display"
          />
        </div>
      </div>
    </div>
  )
}

export default CheggDelight
