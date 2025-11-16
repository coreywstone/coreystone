import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <ul className="footer-links">
          <li><a href="#page-top">Top</a></li>
          <li><Link to="/">Projects</Link></li>
          <li><Link to="/bio">Bio</Link></li>
          <li><Link to="/ideas">Ideas</Link></li>
        </ul>
        
        <ul className="footer-social">
          <li>
            <a href="mailto:coreywstone@gmail.com" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Email">
              <i className="fa fa-envelope"></i>
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/coreywstone" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fa fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/coreywstone" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fa fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/coreywstone/" className="btn-social" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fa fa-linkedin"></i>
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

