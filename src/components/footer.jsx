import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-5 mt-5">
      <div className="container">
        <div className="row mb-4">
          {/* About */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Donaton</h5>
            <p className="text-muted">
              Somos una organización dedicada a hacer una diferencia en el mundo a través 
              de donaciones y voluntariado.
            </p>
          </div>

          {/* Links */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Enlaces útiles</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/nosotros" className="text-decoration-none text-muted hover-link">
                  Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/donar" className="text-decoration-none text-muted hover-link">
                  Donar
                </Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted hover-link">
                  Contacto
                </a>
              </li>

            </ul>
          </div>

          {/* Social Media */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Síguenos</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted text-decoration-none hover-link">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-muted text-decoration-none hover-link">
                <FaTwitter size={24} />
              </a>
              <a href="#" className="text-muted text-decoration-none hover-link">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-muted text-decoration-none hover-link">
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-secondary" />

        {/* Copyright */}
        <div className="row">
          <div className="col-md-6">
            <p className="text-muted small mb-0">
              &copy; 2026 Donaton. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-md-end">

          </div>
        </div>
      </div>
    </footer>
  )
}
