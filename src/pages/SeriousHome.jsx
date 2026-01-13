import { useEffect } from 'react'
import './SeriousHome.css'

function SeriousHome() {
  useEffect(() => {
    // Add serious-theme class to body for background gradient
    document.body.classList.add('serious-theme')
    return () => {
      document.body.classList.remove('serious-theme')
    }
  }, [])

  return (
    <div className="serious-home">
      {/* Empty page with gray background */}
    </div>
  )
}

export default SeriousHome
