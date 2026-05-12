export default function Cuerpo() {
  return (
    <section className="py-5">
      <div className="container-fluid">
        <div className="row align-items-center" style={{ minHeight: '400px' }}>
          {/* Left Side - Text */}
          <div className="col-lg-6 d-flex flex-column justify-content-center">
            <h2 className="display-4 fw-bold mb-4">
              ¿Por qué<br />deben donar?
            </h2>
            <p className="lead text-muted">
              Tu donación hacer una diferencia en la vida de quienes más lo necesitan. 
              Cada contribución nos ayuda a alcanzar nuestros objetivos y cambiar el mundo.
            </p>
          </div>

          {/* Right Side - Button */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <button className="btn btn-primary btn-lg px-5 py-3" style={{ fontSize: '1.2rem' }}>
              Donar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
