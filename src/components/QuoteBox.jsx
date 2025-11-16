import { useState, useEffect, useRef } from 'react'
import './QuoteBox.css'

function QuoteBox({ illustration, quote, author, canStart = false, onComplete }) {
  const [displayedWords, setDisplayedWords] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const wordsRef = useRef([])
  const currentIndexRef = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (quote) {
      wordsRef.current = quote.split(' ')
    }
  }, [quote])

  useEffect(() => {
    if (canStart && !isActive && !isComplete) {
      setIsActive(true)
    }
  }, [canStart, isActive, isComplete])

  useEffect(() => {
    if (isActive && !isComplete && wordsRef.current.length > 0) {
      currentIndexRef.current = 0
      setDisplayedWords([])
      
      intervalRef.current = setInterval(() => {
        if (currentIndexRef.current < wordsRef.current.length) {
          setDisplayedWords(prev => [...prev, wordsRef.current[currentIndexRef.current]])
          currentIndexRef.current++
        } else {
          setIsComplete(true)
          if (onComplete) {
            onComplete()
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
        }
      }, 250) // ~240 words per minute (250ms per word)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isActive, isComplete, onComplete])

  return (
    <div className={`quote-box ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
      <div className="quote-box-illustration">
        {illustration ? (
          <img src={illustration} alt={author || 'Quote author'} />
        ) : (
          <div className="quote-box-placeholder">Illustration</div>
        )}
      </div>
      <div className="quote-bubble">
        <div className="quote-bubble-content">
          {displayedWords.length > 0 ? (
            <p className="quote-text">
              {displayedWords.join(' ')}
              {!isComplete && <span className="quote-cursor">|</span>}
            </p>
          ) : (
            <p className="quote-text-placeholder">...</p>
          )}
        </div>
        {author && isComplete && (
          <p className="quote-author">— {author}</p>
        )}
      </div>
    </div>
  )
}

export default QuoteBox

