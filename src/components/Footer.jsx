import { Link, useLocation } from 'react-router-dom'
import InlineSVG from './InlineSVG'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  return (
    <footer className="footer">
      <div className="footer-container">
        <ul className="footer-links">
          <li><a href="#page-top">Top</a></li>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/bio" className={location.pathname === '/bio' ? 'active' : ''}>
              Bio
            </Link>
          </li>
        </ul>
        
        <ul className="footer-social">
          <li>
            <a href="https://www.linkedin.com/in/coreywstone/" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <InlineSVG src="/img/ui/linkedin-icon.svg" alt="LinkedIn" />
            </a>
          </li>
          <li>
            <a href="mailto:coreywstone@gmail.com" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <InlineSVG src="/img/ui/mail-icon.svg" alt="Email" />
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/coreywstone" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
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

