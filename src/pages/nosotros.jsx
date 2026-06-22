import Header from '../components/header'
import Footer from '../components/footer'

export default function Nosotros() {
  return (
    <>
      <Header />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="shadow rounded p-5 mx-auto text-center" style={{ backgroundColor: '#fff', maxWidth: '600px' }}>
            <h2 className="fw-bold mb-4">Nosotros</h2>
            <p className="lead text-muted">
              Bienvenido a nuestra página. Aquí podrás conocer más sobre nuestra misión y valores.
            </p>
            <img
              src="https://images.unsplash.com/photo-1541976844346-f18aeac57b06?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Nosotros"
              className="img-fluid rounded mb-4"
            />
            <p className="text-muted">
              Nuestra organización se dedica a brindar apoyo y recursos a quienes más lo necesitan. Creemos en la importancia de la solidaridad y el compromiso social.
            </p>
            <br />
            <p className="text-muted">
              A través de nuestras iniciativas, buscamos generar un impacto positivo en la comunidad y fomentar un entorno inclusivo y equitativo para todos.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
