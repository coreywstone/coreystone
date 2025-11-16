import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-name">
          <Link to="/">Corey Stone</Link>
        </div>
        <nav className="header-nav">
          <ul className="nav-tabs">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
              >
                Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/bio" 
                className={`nav-link ${isActive('/bio') ? 'active' : ''}`}
              >
                Bio
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/ideas" 
                className={`nav-link ${isActive('/ideas') ? 'active' : ''}`}
              >
                Ideas
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header

