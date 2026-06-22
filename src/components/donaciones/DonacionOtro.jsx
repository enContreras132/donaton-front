import { useState } from 'react'
import { crearDonacion } from '../../services/apiService'

export default function DonacionOtro() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '5',
    cantidadCustom: '',
    descripcion: '',
    unidad: 'unidades',
    estado: 'bueno',
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

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'Describe qué vas a donar'
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
        tipoRecurso: 'otro',
        cantidad: Number(cantidad),
        unidad: formData.unidad,
        detalles: {
          descripcion: formData.descripcion,
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

      setMensaje('¡Donación registrada correctamente! Nos contactaremos para coordinar la entrega.')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '5',
        cantidadCustom: '',
        descripcion: '',
        unidad: 'unidades',
        estado: 'bueno',
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
      <h3 className="fw-bold mb-2">Donar Otros Artículos</h3>
      <p className="text-muted mb-4">¿Tienes algo más que donar? Todos los aportes son valiosos.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-otro" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-otro"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-otro" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-otro"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label fw-semibold">¿Qué vas a donar?</label>
          <input
            type="text"
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Ej: Libros, juguetes, mochilas, útiles escolares, etc."
          />
          {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="unidad" className="form-label fw-semibold">Unidad de medida</label>
          <select
            className="form-select"
            id="unidad"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
          >
            <option value="unidades">Unidades</option>
            <option value="cajas">Cajas</option>
            <option value="bolsas">Bolsas</option>
            <option value="paquetes">Paquetes</option>
            <option value="kilogramos">Kilogramos</option>
            <option value="metros">Metros</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-otro" className="form-label fw-semibold">Cantidad</label>
          <div className="mb-2 d-flex gap-2 flex-wrap">
            <button type="button" className={`btn ${formData.cantidad === '5' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '5' }))}>5</button>
            <button type="button" className={`btn ${formData.cantidad === '10' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '10' }))}>10</button>
            <button type="button" className={`btn ${formData.cantidad === '20' ? 'btn-dark' : 'btn-outline-secondary'}`} onClick={() => setFormData(prev => ({ ...prev, cantidad: '20' }))}>20</button>
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
          <label htmlFor="estado-otro" className="form-label fw-semibold">Estado del artículo</label>
          <select
            className="form-select"
            id="estado-otro"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="excelente">Excelente</option>
            <option value="bueno">Buen estado</option>
            <option value="aceptable">Aceptable</option>
            <option value="necesita_reparacion">Necesita reparación menor</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-otro" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-otro"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-otro" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-otro"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Detalles adicionales sobre tu donación..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Registrar donación'}
        </button>
      </form>
    </div>
  )
}
