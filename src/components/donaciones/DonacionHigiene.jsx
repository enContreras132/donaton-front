import { useState } from 'react'
import { crearDonacion } from '../../services/apiService'

export default function DonacionHigiene() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '10',
    cantidadCustom: '',
    tipoProducto: 'jabon',
    estado: 'sin_abrir',
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

    if (!formData.tipoProducto.trim()) {
      newErrors.tipoProducto = 'Selecciona un tipo de producto'
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
        tipoRecurso: 'higiene',
        cantidad: Number(cantidad),
        unidad: 'unidades',
        detalles: {
          tipoProducto: formData.tipoProducto,
          estado: formData.estado,
          donador: formData.nombre,
          email: formData.email,
          mensaje: formData.mensaje
        },
        estado: 'REGISTRADA',
        usuarioDonanteId: null,
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación de artículos de higiene registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '10',
        cantidadCustom: '',
        tipoProducto: 'jabon',
        estado: 'sin_abrir',
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
      <h3 className="fw-bold mb-2">Donar Artículos de Higiene</h3>
      <p className="text-muted mb-4">Los productos de higiene son esenciales para la salud y dignidad.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-higiene" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-higiene"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-higiene" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-higiene"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoProducto" className="form-label fw-semibold">Tipo de producto</label>
          <select
            className={`form-select ${errors.tipoProducto ? 'is-invalid' : ''}`}
            id="tipoProducto"
            name="tipoProducto"
            value={formData.tipoProducto}
            onChange={handleChange}
          >
            <option value="">Selecciona un tipo</option>
            <option value="jabon">Jabón</option>
            <option value="pasta_dental">Pasta dental</option>
            <option value="champoo">Champú</option>
            <option value="desodorante">Desodorante</option>
            <option value="papel_higienico">Papel higiénico</option>
            <option value="pañales">Pañales</option>
            <option value="toallitas">Toallitas femeninas</option>
            <option value="gel_antibacterial">Gel antibacterial</option>
            <option value="cepillos">Cepillos de dientes</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoProducto && <div className="invalid-feedback">{errors.tipoProducto}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-higiene" className="form-label fw-semibold">Cantidad</label>
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
          <label htmlFor="estado-higiene" className="form-label fw-semibold">Estado del producto</label>
          <select
            className="form-select"
            id="estado-higiene"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="sin_abrir">Sin abrir (sellado)</option>
            <option value="abierto">Abierto pero intacto</option>
            <option value="como_nuevo">Como nuevo</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-higiene" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-higiene"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-higiene" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-higiene"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Comparte tu mensaje..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Donar artículos de higiene'}
        </button>
      </form>
    </div>
  )
}
