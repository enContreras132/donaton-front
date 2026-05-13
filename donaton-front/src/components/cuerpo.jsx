import { Link } from 'react-router-dom'

export default function Cuerpo() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center shadow rounded p-5" style={{ minHeight: '400px', backgroundColor: '#fff' }}>
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <h2 className="display-4 fw-bold mb-4">
              ¿Por qué<br />es necesario donar?
            </h2>
            <p className="lead text-muted">
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
            </p>
          </div>

          <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center gap-3">
            <Link 
              className="d-inline-flex align-items-center justify-content-center text-decoration-none"
              style={{ 
                fontSize: '1.2rem',
                backgroundColor: '#000',
                color: '#fff',
                padding: '3rem 7rem',
                borderRadius: '0.25rem',
                width: '300px',
                height: '120px'
              }} 
              to="/donar">
              Donar
            </Link>
            <Link 
              className="d-inline-flex align-items-center justify-content-center text-decoration-none hover-link"
              style={{ 
                fontSize: '1.2rem',
                backgroundColor: '#000',
                color: '#fff',
                padding: '3rem 7rem',
                borderRadius: '0.25rem',
                width: '300px',
                height: '120px'
              }} 
              to="/">
              Reportar una necesidad
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
