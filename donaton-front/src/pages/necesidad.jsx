import Header from '../components/header'
import Footer from '../components/footer'

export default function Necesidad() {
  return (
    <>
      <Header />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
            <h2 className="fw-bold mb-4">Reportar una necesidad</h2>
            <p className="lead text-muted">
              Aquí puedes reportar una necesidad que conoces o que has experimentado.
            </p>
            <form className="mt-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Descripción de la necesidad</label>
                <textarea className="form-control" rows="5" placeholder="Cuéntanos sobre la necesidad..."></textarea>
              </div>
              <button type="submit" className="btn btn-dark">Enviar reporte</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
