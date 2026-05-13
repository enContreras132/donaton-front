import { useState } from 'react'
import { crearDonacion } from '../services/bffService'

export default function Donacion() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    monto: '50',
    montoCustom: '',
    metodoPago: 'tarjeta',
    mensaje: '',
    tipoRecurso: 'dinero',
    necesidadId: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    const monto = formData.monto === 'custom'
      ? formData.montoCustom
      : formData.monto

    if (!monto || Number(monto) <= 0) {
      newErrors.monto = 'Ingresa un monto válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setMensaje('')

      const monto = formData.monto === 'custom'
        ? formData.montoCustom
        : formData.monto

      const donacion = {
        tipoRecurso: formData.tipoRecurso,
        cantidad: Number(monto),
        estado: 'REGISTRADA',
        usuarioDonanteId: null,
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        monto: '50',
        montoCustom: '',
        metodoPago: 'tarjeta',
        mensaje: '',
        tipoRecurso: 'dinero',
        necesidadId: ''
      })
    } catch (error) {
      setMensaje(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
              <h2 className="fw-bold mb-2">Realizar Donación</h2>
              <p className="text-muted mb-4">Tu apoyo hace la diferencia. Elige el monto que deseas donar.</p>

              {mensaje && (
                <div className="alert alert-info" role="alert">
                  {mensaje}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label fw-semibold">Nombre completo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Correo electrónico</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="tipoRecurso" className="form-label fw-semibold">Tipo de recurso</label>
                  <select
                    className="form-select"
                    id="tipoRecurso"
                    name="tipoRecurso"
                    value={formData.tipoRecurso}
                    onChange={handleChange}
                  >
                    <option value="dinero">Dinero</option>
                    <option value="alimentos">Alimentos</option>
                    <option value="agua">Agua</option>
                    <option value="ropa">Ropa</option>
                    <option value="medicamentos">Medicamentos</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="monto" className="form-label fw-semibold">Cantidad / monto de donación</label>
                  <div className="mb-2 d-flex gap-2">
                    <button type="button" className={`btn ${formData.monto === '25' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, monto: '25' }))}>25</button>
                    <button type="button" className={`btn ${formData.monto === '50' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, monto: '50' }))}>50</button>
                    <button type="button" className={`btn ${formData.monto === '100' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, monto: '100' }))}>100</button>
                    <button type="button" className={`btn ${formData.monto === 'custom' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, monto: 'custom' }))}>Otro</button>
                  </div>

                  {formData.monto === 'custom' && (
                    <input
                      type="number"
                      className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
                      name="montoCustom"
                      value={formData.montoCustom}
                      onChange={handleChange}
                      placeholder="Ingresa una cantidad"
                      min="1"
                    />
                  )}

                  {errors.monto && <div className="text-danger mt-1">{errors.monto}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="necesidadId" className="form-label fw-semibold">ID de necesidad asociada opcional</label>
                  <input
                    type="number"
                    className="form-control"
                    id="necesidadId"
                    name="necesidadId"
                    value={formData.necesidadId}
                    onChange={handleChange}
                    placeholder="Ej: 1"
                    min="1"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="metodoPago" className="form-label fw-semibold">Método de pago</label>
                  <select
                    className="form-select"
                    id="metodoPago"
                    name="metodoPago"
                    value={formData.metodoPago}
                    onChange={handleChange}
                  >
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                    <option value="paypal">PayPal</option>
                    <option value="transferencia">Transferencia bancaria</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="mensaje" className="form-label fw-semibold">Mensaje opcional</label>
                  <textarea
                    className="form-control"
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Comparte tu mensaje..."
                    rows="3"
                  />
                </div>

                {/* Botón Submit */}
                <button type="submit" className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
                  Donar ahora
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
