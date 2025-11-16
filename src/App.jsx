import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Bio from './pages/Bio'
import ProjectPage from './pages/ProjectPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/projects/:projectName" element={<ProjectPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

