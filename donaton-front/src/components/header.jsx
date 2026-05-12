import { FaUserCircle } from 'react-icons/fa'

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
      <a className="navbar-brand fw-bold" href="/">
        <img 
          src="src/assets/logo.png" 
          alt="Logo Donaton" 
          height="70"
          className="d-inline-block align-text-top"
        />
      </a>

      <div className="d-flex" style={{ gap: '10rem' }}>
        <a className="nav-link" href="/nosotros">
          Nosotros
        </a>
        <a className="nav-link" href="/donar">
          Donaciones
        </a>
        <a className="nav-link" href="/logear">
          Registrarse
        </a>
      </div>

      <a href="/perfil" className="text-decoration-none text-dark">
        <FaUserCircle size={28} />
      </a>
    </nav>
  )
}
