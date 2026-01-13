import { useTheme } from '../contexts/ThemeContext'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-toggle">
      <a
        href="https://coreystone.com"
        className={`theme-button ${theme === 'serious' ? 'active' : ''}`}
        aria-label="View serious version on coreystone.com"
      >
        <img 
          src="/img/CoreyStone-sq2022.jpg" 
          alt="Corey Stone" 
          className="theme-icon"
          width="16"
          height="16"
        />
        <span className="theme-label serious-label">srs</span>
      </a>
      <button
        className={`theme-button ${theme === 'fun' ? 'active' : ''}`}
        onClick={() => setTheme('fun')}
        aria-label="Switch to fun theme"
      >
        <img 
          src="/favicon.png" 
          alt="Fun theme" 
          className="theme-icon"
          width="16"
          height="16"
        />
        <span className="theme-label fun-label">Fun</span>
      </button>
    </div>
  )
}

export default ThemeToggle
