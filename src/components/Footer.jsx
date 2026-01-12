import { Link, useLocation } from 'react-router-dom'
import InlineSVG from './InlineSVG'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  const playButtonSound = () => {
    const audio = new Audio('/img/ui/buttonclick.mp3')
    audio.play().catch(err => {
      // Ignore audio play errors (user interaction may be required)
      console.log('Audio play failed:', err)
    })
  }

  const handleNavLinkClick = () => {
    // Scroll to top immediately before navigation
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <ul className="footer-links">
          <li><a href="#page-top">Top</a></li>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={handleNavLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/bio" className={location.pathname === '/bio' ? 'active' : ''} onClick={handleNavLinkClick}>
              Bio
            </Link>
          </li>
        </ul>
        
        <ul className="footer-social">
          <li>
            <a href="https://www.linkedin.com/in/coreywstone/" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" onClick={playButtonSound}>
              <InlineSVG src="/img/ui/linkedin-icon.svg" alt="LinkedIn" />
            </a>
          </li>
          <li>
            <a href="mailto:coreywstone@gmail.com" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Email" onClick={playButtonSound}>
              <InlineSVG src="/img/ui/mail-icon.svg" alt="Email" />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/coreywstone" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Facebook" onClick={playButtonSound}>
              <InlineSVG src="/img/ui/facebook-icon.svg" alt="Facebook" />
            </a>
          </li>
        </ul>
        
        <p className="footer-copyright">
          &copy; {currentYear} Corey Stone
        </p>
      </div>
    </footer>
  )
}

export default Footer

