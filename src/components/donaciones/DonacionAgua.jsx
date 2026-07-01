import { useState } from 'react'
import { crearDonacion } from '../../services/apiService'

export default function DonacionAgua() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '10',
    cantidadCustom: '',
    unidad: 'litros',
    tipoAgua: 'potable',
    presentacion: 'botellas',
    mensaje: '',
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

    const cantidad = formData.cantidad === 'custom'
      ? formData.cantidadCustom
      : formData.cantidad

    if (!cantidad || Number(cantidad) <= 0) {
      newErrors.cantidad = 'Ingresa una cantidad válida'
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

      const cantidad = formData.cantidad === 'custom'
        ? formData.cantidadCustom
        : formData.cantidad

      const donacion = {
        tipoRecurso: 'AGUA',
        detalleRecurso: `Tipo: ${formData.tipoAgua}, Presentación: ${formData.presentacion}, Unidad: ${formData.unidad}`,
        cantidad: Number(cantidad),
        origen: formData.nombre,
        nombreDonante: formData.nombre,
        contactoDonante: formData.email,
        estado: 'REGISTRADA',
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación de agua registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '10',
        cantidadCustom: '',
        unidad: 'litros',
        tipoAgua: 'potable',
        presentacion: 'botellas',
        mensaje: '',
        necesidadId: ''
      })
    } catch (error) {
      setMensaje(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
      <h3 className="fw-bold mb-2">Donar Agua</h3>
      <p className="text-muted mb-4">El agua limpia es esencial. Tu donación salva vidas.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-agua" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-agua"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-agua" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-agua"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoAgua" className="form-label fw-semibold">Tipo de agua</label>
          <select
            className="form-select"
            id="tipoAgua"
            name="tipoAgua"
            value={formData.tipoAgua}
            onChange={handleChange}
          >
            <option value="potable">Agua potable</option>
            <option value="mineral">Agua mineral</option>
            <option value="purificada">Agua purificada</option>
            <option value="filtrada">Agua filtrada</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="presentacion" className="form-label fw-semibold">Presentación</label>
          <select
            className="form-select"
            id="presentacion"
            name="presentacion"
            value={formData.presentacion}
            onChange={handleChange}
          >
            <option value="botellas">Botellas</option>
            <option value="garrafas">Garrafas</option>
            <option value="bidones">Bidones</option>
            <option value="tanques">Tanques</option>
            <option value="bolsas">Bolsas</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-agua" className="form-label fw-semibold">Cantidad</label>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <button type="button" className={`btn ${formData.cantidad === '10' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '10' }))}>10 {formData.unidad}</button>
            <button type="button" className={`btn ${formData.cantidad === '25' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '25' }))}>25 {formData.unidad}</button>
            <button type="button" className={`btn ${formData.cantidad === '50' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '50' }))}>50 {formData.unidad}</button>
            <button type="button" className={`btn ${formData.cantidad === 'custom' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: 'custom' }))}>Otra cantidad</button>
          </div>

          <div className="mb-2">
            <label htmlFor="unidad" className="form-label fw-semibold">Unidad de medida</label>
            <select
              className="form-select"
              id="unidad"
              name="unidad"
              value={formData.unidad}
              onChange={handleChange}
            >
              <option value="litros">Litros (L)</option>
              <option value="galones">Galones</option>
              <option value="botellas">Botellas</option>
              <option value="unidades">Unidades</option>
            </select>
          </div>

          {formData.cantidad === 'custom' && (
            <input
              type="number"
              className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
              name="cantidadCustom"
              value={formData.cantidadCustom}
              onChange={handleChange}
              placeholder="Ingresa la cantidad"
              min="1"
            />
          )}

          {errors.cantidad && <div className="text-danger mt-1">{errors.cantidad}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-agua" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-agua"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-agua" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-agua"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Comparte tu mensaje..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Donar agua'}
        </button>
      </form>
    </div>
  )
}
