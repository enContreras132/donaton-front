import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Donar from './pages/donar'
import Nosotros from './pages/nosotros'
import Necesidad from './pages/necesidad'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donar" element={<Donar />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/necesidad" element={<Necesidad />} />
      </Routes>
    </Router>
  )
}

export default App
