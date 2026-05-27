import { useState } from 'react'

import Header from '../components/header'
import Footer from '../components/footer'
import { crearNecesidad } from '../services/bffService'

export default function Necesidad() {
  const [formData, setFormData] = useState({
    zona: '',
    tipoRecurso: 'alimentos',
    cantidadSolicitada: '',
    prioridad: 'MEDIA',
    descripcion: ''
  })

  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setMensaje('')

      const necesidad = {
      recursoNecesitado: formData.tipoRecurso,
      cantidad: Number(formData.cantidadSolicitada),
      ubicacion: formData.zona,
      descripcion: formData.descripcion,
      prioridad: formData.prioridad === 'CRITICA' ? 'URGENTE' : formData.prioridad
    }

      await crearNecesidad(necesidad)

      setMensaje('Necesidad registrada correctamente')
      setFormData({
        zona: '',
        tipoRecurso: 'alimentos',
        cantidadSolicitada: '',
        prioridad: 'MEDIA',
        descripcion: ''
      })
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo confirmar la respuesta, pero revisa si la necesidad fue registrada.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <section className="py-5 bg-light">
        <div className="container">
          <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
            <h2 className="fw-bold mb-4">Reportar una necesidad</h2>
            <p className="lead text-muted">
              Aquí puedes reportar una necesidad en terreno para que sea gestionada por Donaton.
            </p>

            {mensaje && (
              <div className="alert alert-info" role="alert">
                {mensaje}
              </div>
            )}

            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="zona" className="form-label fw-semibold">Zona</label>
                <input
                  id="zona"
                  name="zona"
                  className="form-control"
                  value={formData.zona}
                  onChange={handleChange}
                  placeholder="Ej: Santiago Centro"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tipoRecurso" className="form-label fw-semibold">Tipo de recurso</label>
                <select
                  id="tipoRecurso"
                  name="tipoRecurso"
                  className="form-select"
                  value={formData.tipoRecurso}
                  onChange={handleChange}
                >
                  <option value="alimentos">Alimentos</option>
                  <option value="agua">Agua</option>
                  <option value="ropa">Ropa</option>
                  <option value="medicamentos">Medicamentos</option>
                  <option value="transporte">Transporte</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="cantidadSolicitada" className="form-label fw-semibold">Cantidad solicitada</label>
                <input
                  id="cantidadSolicitada"
                  name="cantidadSolicitada"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formData.cantidadSolicitada}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="prioridad" className="form-label fw-semibold">Prioridad</label>
                <select
                  id="prioridad"
                  name="prioridad"
                  className="form-select"
                  value={formData.prioridad}
                  onChange={handleChange}
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label fw-semibold">Descripción de la necesidad</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  rows="5"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre la necesidad..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar reporte'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
