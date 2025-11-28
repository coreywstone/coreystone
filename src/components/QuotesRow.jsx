import { useEffect, useRef, useState } from 'react'
import QuotePanel from './QuotePanel'
import './QuotesRow.css'

function QuotesRow({ quotes = [] }) {
  const [completedQuotes, setCompletedQuotes] = useState(new Set())
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleQuoteComplete = (index) => {
    setCompletedQuotes(prev => new Set([...prev, index]))
  }

  // Check if previous quote is completed
  const canStart = (index) => {
    if (index === 0) return isVisible
    return isVisible && completedQuotes.has(index - 1)
  }

  return (
    <section ref={sectionRef} className="quotes-row">
      <div className="quotes-row-container">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <QuotePanel
              key={index}
              name={quote.name}
              bgSrc={quote.bgSrc}
              picSrc={quote.picSrc}
              titleSrc={quote.titleSrc}
              words1Src={quote.words1Src}
              words2Src={quote.words2Src}
              words3Src={quote.words3Src}
              canStart={canStart(index)}
              onComplete={() => handleQuoteComplete(index)}
              characterPosition={quote.characterPosition || 'bottom-left'}
              characterOffsetX={quote.characterOffsetX || 0}
              characterOffsetY={quote.characterOffsetY || 0}
              bubblePosition={quote.bubblePosition || 'right'}
            />
          ))
        ) : (
          <div className="quotes-row-placeholder">
            <p>Quote boxes will appear here</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default QuotesRow

