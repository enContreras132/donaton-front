import Header from '../components/header'
import Footer from '../components/footer'

export default function Nosotros() {
  return (
    <>
      <Header />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
            <h2 className="fw-bold mb-4">Nosotros</h2>
            <p className="lead text-muted">
              Bienvenido a nuestra página. Aquí pudrás conocer más sobre nuestra misión y valores.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
