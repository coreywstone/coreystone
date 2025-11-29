import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './MenuButton.css'

function MenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isShrinking, setIsShrinking] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleButtonClick = () => {
    if (!isOpen) {
      // Shrink first, then show menu
      setIsShrinking(true)
      setTimeout(() => {
        setIsShrinking(false)
        setIsOpen(true)
      }, 150) // Shrink duration
    } else {
      setIsOpen(false)
    }
  }

  return (
    <div className="menu-button-wrapper">
      <button
        ref={buttonRef}
        className={`menu-button ${isShrinking ? 'shrinking' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleButtonClick}
        aria-label="Menu"
      >
        <img 
          src="/img/main-menu-nav.svg" 
          alt="Menu" 
          className="menu-icon"
        />
      </button>
      
      {isOpen && (
        <div 
          ref={menuRef}
          className="menu-dropdown"
        >
          <Link 
            to="/bio" 
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Bio
          </Link>
          <a 
            href="mailto:coreywstone@gmail.com" 
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Email
          </a>
          <a 
            href="/Corey-Stone-Resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="menu-item"
            onClick={() => setIsOpen(false)}
          >
            Resume <i className="fa fa-file-pdf-o"></i>
          </a>
        </div>
      )}
    </div>
  )
}

export default MenuButton

