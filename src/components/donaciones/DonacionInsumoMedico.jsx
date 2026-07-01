import { useState } from 'react'
import { crearDonacion } from '../../services/apiService'

export default function DonacionInsumoMedico() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '10',
    cantidadCustom: '',
    tipoInsumo: 'medicamentos',
    especificacion: '',
    estado: 'sin_abrir',
    fecha_vencimiento: '',
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

    if (!formData.tipoInsumo.trim()) {
      newErrors.tipoInsumo = 'Selecciona un tipo de insumo'
    }

    if (formData.fecha_vencimiento && formData.fecha_vencimiento < new Date().toISOString().split('T')[0]) {
      newErrors.fecha_vencimiento = 'La fecha de vencimiento ya ha pasado'
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
        tipoRecurso: 'INSUMO_MEDICO',
        detalleRecurso: `Tipo: ${formData.tipoInsumo}, Especificación: ${formData.especificacion}, Estado: ${formData.estado}${formData.fecha_vencimiento ? `, Vence: ${formData.fecha_vencimiento}` : ''}`,
        cantidad: Number(cantidad),
        origen: formData.nombre,
        nombreDonante: formData.nombre,
        contactoDonante: formData.email,
        estado: 'REGISTRADA',
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación de insumo médico registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '10',
        cantidadCustom: '',
        tipoInsumo: 'medicamentos',
        especificacion: '',
        estado: 'sin_abrir',
        fecha_vencimiento: '',
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
      <h3 className="fw-bold mb-2">Donar Insumo Médico</h3>
      <p className="text-muted mb-4">Tu donación de insumos médicos salva vidas en comunidades sin acceso.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-medico" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-medico"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-medico" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-medico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoInsumo" className="form-label fw-semibold">Tipo de insumo médico</label>
          <select
            className={`form-select ${errors.tipoInsumo ? 'is-invalid' : ''}`}
            id="tipoInsumo"
            name="tipoInsumo"
            value={formData.tipoInsumo}
            onChange={handleChange}
          >
            <option value="">Selecciona un tipo</option>
            <option value="medicamentos">Medicamentos</option>
            <option value="vendajes">Vendajes y curitas</option>
            <option value="sueros">Sueros y soluciones</option>
            <option value="jeringas">Jeringas y agujas</option>
            <option value="mascarillas">Mascarillas y EPP</option>
            <option value="termometros">Termómetros</option>
            <option value="antibioticos">Antibióticos</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoInsumo && <div className="invalid-feedback">{errors.tipoInsumo}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="especificacion" className="form-label fw-semibold">Especificación (ej: nombre del medicamento)</label>
          <input
            type="text"
            className="form-control"
            id="especificacion"
            name="especificacion"
            value={formData.especificacion}
            onChange={handleChange}
            placeholder="Ej: Paracetamol 500mg"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-medico" className="form-label fw-semibold">Cantidad</label>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <button type="button" className={`btn ${formData.cantidad === '10' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '10' }))}>10</button>
            <button type="button" className={`btn ${formData.cantidad === '25' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '25' }))}>25</button>
            <button type="button" className={`btn ${formData.cantidad === '50' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '50' }))}>50</button>
            <button type="button" className={`btn ${formData.cantidad === 'custom' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: 'custom' }))}>Otra cantidad</button>
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
          <label htmlFor="estado-medico" className="form-label fw-semibold">Estado del insumo</label>
          <select
            className="form-select"
            id="estado-medico"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="sin_abrir">Sin abrir (sellado)</option>
            <option value="abierto">Abierto pero intacto</option>
            <option value="parcialmente_usado">Parcialmente usado</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="fecha_vencimiento" className="form-label fw-semibold">Fecha de vencimiento (opcional)</label>
          <input
            type="date"
            className={`form-control ${errors.fecha_vencimiento ? 'is-invalid' : ''}`}
            id="fecha_vencimiento"
            name="fecha_vencimiento"
            value={formData.fecha_vencimiento}
            onChange={handleChange}
          />
          {errors.fecha_vencimiento && <div className="invalid-feedback">{errors.fecha_vencimiento}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-medico" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-medico"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-medico" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-medico"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Comparte tu mensaje..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Donar insumo médico'}
        </button>
      </form>
    </div>
  )
}
