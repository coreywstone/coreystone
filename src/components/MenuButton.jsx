import { useState, useRef, useEffect } from 'react'
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
        }, 300) // Match animation duration
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
    playButtonSound()
    setIsModalClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsModalClosing(false)
    }, 300) // Match animation duration
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
            <a 
              href="https://coreystone.com/bio/" 
              className="menu-item"
              onClick={() => setIsOpen(false)}
            >
              Bio
            </a>
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
        <div className="modal-overlay">
          <div 
            ref={modalRef}
            className={`modal-content ${isModalClosing ? 'closing' : ''}`}
          >
            <div className="modal-text-container">
              <p>I wondered, how might I make my portfolio engaging and easy to read? Comics! And no more hand-coding HTML/CSS, so I vibe-coded it in <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer">Cursor</a>, used <a href="https://recraft.ai" target="_blank" rel="noopener noreferrer">Recraft.ai</a> for imagery, and <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer">Perplexity</a> for research and how-to's. It's been fun!</p>
            </div>
            <button
              className="modal-close-button"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default MenuButton

