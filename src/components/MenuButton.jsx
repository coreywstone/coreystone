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
    setIsOpen(!isOpen)
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
            <div className="modal-text-container">
              <p>I wondered, how might I make my portfolio engaging and easy to read? Comics! And after years of hand-coding HTML/CSS, I built this in <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">Cursor</a>, used <a href="https://recraft.ai" target="_blank" rel="noopener noreferrer">Recraft.ai</a> for image gen, <a href="https://getsoundly.com/" target="_blank" rel="noopener noreferrer">Soundly</a>, and <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer">Perplexity</a> for research. It's been fun! 🤠</p>
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

