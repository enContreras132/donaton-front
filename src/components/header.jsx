import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav 
      className="navbar navbar-light bg-light shadow-sm"
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '1rem 2rem'
      }}
    >
      <Link className="navbar-brand fw-bold text-decoration-none text-dark" to="/">
        <img 
          src="src/assets/logo.png" 
          alt="Logo Donaton" 
          height="70"
          className="d-inline-block align-text-top"
        />
      </Link>

      <div className="d-flex" style={{ gap: '10rem' }}>
        <Link className="nav-link text-decoration-none text-dark" to="/nosotros">
          Nosotros
        </Link>
        <Link className="nav-link text-decoration-none text-dark" to="/donar">
          Donar
        </Link>
        <Link className="nav-link text-decoration-none text-dark" to="/necesidad">
          Necesidades
        </Link>
      </div>

      <Link to="/perfil" className="text-decoration-none text-dark">
        <FaUserCircle size={28} />
      </Link>
    </nav>
  )
}
