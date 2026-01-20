import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InlineSVG from './InlineSVG'
import './MenuButton.css'

function MenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalClosing, setIsModalClosing] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)
  const modalRef = useRef(null)

  const playButtonSound = () => {
    const audio = new Audio('/img/ui/buttonclick.mp3')
    audio.play().catch(err => {
      // Ignore audio play errors (user interaction may be required)
      console.log('Audio play failed:', err)
    })
  }

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

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalClosing(true)
        setTimeout(() => {
          setIsModalOpen(false)
          setIsModalClosing(false)
        }, 250) // Match closing animation duration
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutsideModal)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const handleButtonClick = () => {
    setIsModalOpen(true)
  }

  const handleAboutSiteClick = () => {
    setIsOpen(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsModalClosing(false)
    }, 250) // Match closing animation duration
  }

  const handleNavLinkClick = () => {
    setIsOpen(false)
    // Scroll to top immediately before navigation
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  return (
    <>
      <div className="menu-button-wrapper">
        <button
          ref={buttonRef}
          className={`menu-button ${isOpen ? 'open' : ''}`}
          onClick={handleButtonClick}
          aria-label="Menu"
        >
          <span className="menu-icon-wrapper">
            <img 
              src="/img/main-menu-nav.svg" 
              alt="Menu" 
              className="menu-icon menu-icon-default"
            />
            <img 
              src="/img/main-menu-nav-hover.svg" 
              alt="Menu" 
              className="menu-icon menu-icon-hover"
            />
          </span>
        </button>
        
        {isOpen && (
          <div 
            ref={menuRef}
            className="menu-dropdown"
          >
            <Link 
              to="/" 
              className="menu-item"
              onClick={handleNavLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/bio" 
              className="menu-item"
              onClick={handleNavLinkClick}
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
              href="https://coreystone.com/Corey-Stone-Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              Resume <i className="fa fa-file-pdf-o"></i>
            </a>
            <button
              className="menu-item"
              onClick={handleAboutSiteClick}
            >
              About this site
            </button>
            <a
              href="https://coreystone.com"
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              Serious version <InlineSVG src="/img/ui/external-link.svg" alt="" className="menu-item-icon" />
            </a>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={`modal-overlay ${isModalClosing ? 'closing' : ''}`}>
          <div 
            ref={modalRef}
            className={`modal-content ${isModalClosing ? 'closing' : ''}`}
          >
            <button
              className="modal-close-icon-button"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <InlineSVG src="/img/ui/close.svg" alt="Close" />
            </button>
            
            <div className="modal-header">
              <div className="modal-nav-items">
                <Link 
                  to="/" 
                  className="modal-nav-item"
                  onClick={() => {
                    handleNavLinkClick()
                    handleCloseModal()
                  }}
                >
                  <div className="modal-nav-icon">
                    <InlineSVG src="/img/menu/home-icon.svg" alt="Home" />
                  </div>
                  <span className="modal-nav-label">HOME</span>
                </Link>
                <a 
                  href="https://coreystone.com/Corey-Stone-Resume.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="modal-nav-item"
                  onClick={handleCloseModal}
                >
                  <div className="modal-nav-icon">
                    <InlineSVG src="/img/menu/resume-icon.svg" alt="Resume" />
                  </div>
                  <span className="modal-nav-label">RESUME</span>
                </a>
                <a 
                  href="mailto:coreywstone@gmail.com" 
                  className="modal-nav-item"
                  onClick={handleCloseModal}
                >
                  <div className="modal-nav-icon">
                    <InlineSVG src="/img/menu/email-icon.svg" alt="Email" />
                  </div>
                  <span className="modal-nav-label">EMAIL</span>
                </a>
                <Link 
                  to="/bio" 
                  className="modal-nav-item"
                  onClick={() => {
                    handleNavLinkClick()
                    handleCloseModal()
                  }}
                >
                  <div className="modal-nav-icon">
                    <InlineSVG src="/img/menu/about-icon.svg" alt="Bio" />
                  </div>
                  <span className="modal-nav-label">BIO</span>
                </Link>
              </div>
            </div>
            
            <div className="modal-bubble-separator">
              <img src="/img/menu/about-this-site-bubble-top.svg" alt="" />
            </div>
            
            <div className="modal-speech-bubble">
              <div className="modal-text-container">
                <p>I WONDERED, HOW MIGHT I MAKE MY PORTFOLIO FUN AND DIGESTIBLE? <strong><em>COMICS!</em></strong> SO I'M BUILDING THIS IN <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">CURSOR</a>, <a href="https://recraft.ai" target="_blank" rel="noopener noreferrer">RECRAFT</a>, <a href="https://getsoundly.com/" target="_blank" rel="noopener noreferrer">SOUNDLY</a>, & <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer">PERPLEXITY</a>. IT'S BEEN FUN! 🤠</p>
              </div>
            </div>
            
            <div className="modal-image-container">
              <img src="/img/me/about-this-site-bg-50.jpg" alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MenuButton

