import { useState } from 'react'
import { crearDonacion } from '../../services/apiService'

export default function DonacionRopa() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: '5',
    cantidadCustom: '',
    tipoRopa: 'camisetas',
    genero: 'unisex',
    estado: 'nueva',
    talla: 'M',
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

    if (!formData.tipoRopa.trim()) {
      newErrors.tipoRopa = 'Selecciona un tipo de ropa'
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
        tipoRecurso: 'ropa',
        cantidad: Number(cantidad),
        unidad: 'prendas',
        detalles: {
          tipoRopa: formData.tipoRopa,
          genero: formData.genero,
          talla: formData.talla,
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

      setMensaje('¡Donación de ropa registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        cantidad: '5',
        cantidadCustom: '',
        tipoRopa: 'camisetas',
        genero: 'unisex',
        estado: 'nueva',
        talla: 'M',
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
      <h3 className="fw-bold mb-2">Donar Ropa</h3>
      <p className="text-muted mb-4">La ropa que dones llegará a personas que lo necesitan.</p>

      {mensaje && (
        <div className="alert alert-info" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre-ropa" className="form-label fw-semibold">Nombre completo</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre-ropa"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="email-ropa" className="form-label fw-semibold">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email-ropa"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="tipoRopa" className="form-label fw-semibold">Tipo de ropa</label>
          <select
            className={`form-select ${errors.tipoRopa ? 'is-invalid' : ''}`}
            id="tipoRopa"
            name="tipoRopa"
            value={formData.tipoRopa}
            onChange={handleChange}
          >
            <option value="">Selecciona un tipo</option>
            <option value="camisetas">Camisetas</option>
            <option value="pantalones">Pantalones</option>
            <option value="vestidos">Vestidos</option>
            <option value="abrigos">Abrigos y chaquetas</option>
            <option value="zapatos">Zapatos</option>
            <option value="ropa_interior">Ropa interior</option>
            <option value="accesorios">Accesorios</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoRopa && <div className="invalid-feedback">{errors.tipoRopa}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="genero" className="form-label fw-semibold">Género</label>
          <select
            className="form-select"
            id="genero"
            name="genero"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="unisex">Unisex</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="infantil">Infantil</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="talla" className="form-label fw-semibold">Talla</label>
          <select
            className="form-select"
            id="talla"
            name="talla"
            value={formData.talla}
            onChange={handleChange}
          >
            <option value="XS">Extra pequeña (XS)</option>
            <option value="S">Pequeña (S)</option>
            <option value="M">Mediana (M)</option>
            <option value="L">Grande (L)</option>
            <option value="XL">Extra grande (XL)</option>
            <option value="XXL">2XL</option>
            <option value="mixta">Mixta</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="cantidad-ropa" className="form-label fw-semibold">Cantidad de prendas</label>
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
          <label htmlFor="estado-ropa" className="form-label fw-semibold">Estado de la ropa</label>
          <select
            className="form-select"
            id="estado-ropa"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="nueva">Nueva</option>
            <option value="como_nueva">Como nueva</option>
            <option value="buena">Buen estado</option>
            <option value="aceptable">Aceptable</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="necesidadId-ropa" className="form-label fw-semibold">ID de necesidad asociada (opcional)</label>
          <input
            type="number"
            className="form-control"
            id="necesidadId-ropa"
            name="necesidadId"
            value={formData.necesidadId}
            onChange={handleChange}
            placeholder="Ej: 1"
            min="1"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="mensaje-ropa" className="form-label fw-semibold">Mensaje opcional</label>
          <textarea
            className="form-control"
            id="mensaje-ropa"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Comparte tu mensaje..."
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-2" style={{ fontSize: '1.1rem' }}>
          {loading ? 'Procesando...' : 'Donar ropa'}
        </button>
      </form>
    </div>
  )
}
