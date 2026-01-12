import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

function Layout({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Load Font Awesome
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'
    document.head.appendChild(link)

    // Load Rive
    const riveScript = document.createElement('script')
    riveScript.src = 'https://unpkg.com/@rive-app/canvas'
    document.head.appendChild(riveScript)

    return () => {
      // Cleanup if needed
    }
  }, [])

  // Scroll to top on route change
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div id="page-top" className="app">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout

