import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/home'
import Donar from './pages/donar'
import Nosotros from './pages/nosotros'
import Necesidad from './pages/necesidad'
import Admin from './pages/admin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authData = localStorage.getItem('adminAuth')
    setIsAuthenticated(!!authData)
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donar" element={<Donar />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/necesidad" element={<Necesidad />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/login" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
