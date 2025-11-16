import { useEffect, useRef, useState } from 'react'
import QuoteBox from './QuoteBox'
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
      { threshold: 0.3 }
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
            <QuoteBox
              key={index}
              illustration={quote.illustration}
              quote={quote.quote}
              author={quote.author}
              canStart={canStart(index)}
              onComplete={() => handleQuoteComplete(index)}
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

