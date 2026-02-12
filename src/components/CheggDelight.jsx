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
              For the ikea effect, dark mode & unsplash options.
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
    </div>
  )
}

export default CheggDelight
