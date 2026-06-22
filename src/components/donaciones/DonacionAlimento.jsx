import { useState } from 'react'
import { crearDonacion } from '../../services/donacionesService'

export default function DonacionAlimento() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '5',
    cantidadCustom: '',
    unidad: 'kg',
    tipoAlimento: 'cereales',
    estado: 'sin_abrir',
    metodoPago: 'no_aplica',
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

    if (!formData.tipoAlimento.trim()) {
      newErrors.tipoAlimento = 'Selecciona un tipo de alimento'
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
        tipoRecurso: 'ALIMENTO',
        detalleRecurso: `${formData.tipoAlimento} - Estado: ${formData.estado}`,
        cantidad: Number(cantidad),
        origen: formData.nombre,
        nombreDonante: formData.nombre,
        contactoDonante: formData.email,
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación de alimento registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '5',
        cantidadCustom: '',
        unidad: 'kg',
        tipoAlimento: 'cereales',
        estado: 'sin_abrir',
        metodoPago: 'no_aplica',
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
      <h3 className="fw-bold mb-2">Donar Alimento</h3>
      <p className="text-muted mb-4">Tu aporte de alimentos es vital para las familias necesitadas.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-alimento" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-alimento"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-alimento" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-alimento"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoAlimento" className="form-label fw-semibold">Tipo de alimento</label>
          <select
            className={`form-select ${errors.tipoAlimento ? 'is-invalid' : ''}`}
            id="tipoAlimento"
            name="tipoAlimento"
            value={formData.tipoAlimento}
            onChange={handleChange}
          >
            <option value="">Selecciona un tipo</option>
            <option value="cereales">Cereales y granos</option>
            <option value="legumbres">Legumbres</option>
            <option value="conservas">Conservas</option>
            <option value="lacteos">Lácteos</option>
            <option value="frutas_verduras">Frutas y verduras</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoAlimento && <div className="invalid-feedback">{errors.tipoAlimento}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-alimento" className="form-label fw-semibold">Cantidad</label>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <button type="button" className={`btn ${formData.cantidad === '5' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '5' }))}>5 {formData.unidad}</button>
            <button type="button" className={`btn ${formData.cantidad === '10' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '10' }))}>10 {formData.unidad}</button>
            <button type="button" className={`btn ${formData.cantidad === '20' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '20' }))}>20 {formData.unidad}</button>
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
              <option value="kg">Kilogramos (kg)</option>
              <option value="litros">Litros (L)</option>
              <option value="unidades">Unidades</option>
              <option value="paquetes">Paquetes</option>
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
          <label htmlFor="estado" className="form-label fw-semibold">Estado del alimento</label>
          <select
            className="form-select"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="sin_abrir">Sin abrir</option>
            <option value="abierto">Abierto pero íntegro</option>
            <option value="vencimiento_proximo">Vencimiento próximo</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-alimento" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-alimento"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-alimento" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-alimento"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Comparte tu mensaje..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Donar alimento'}
        </button>
      </form>
    </div>
  )
}
