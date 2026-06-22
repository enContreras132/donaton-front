import { useState, useEffect } from 'react'
import { obtenerDonaciones, eliminarDonacion } from '../services/donacionesService'

/**
 * Componente de ejemplo que muestra cómo:
 * - Usar axios con el servicio de donaciones
 * - Manejar loading y errores
 * - Listar datos del backend
 * - Eliminar registros
 */
export default function ListarDonacionesEjemplo() {
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar donaciones al montar el componente
  useEffect(() => {
    cargarDonaciones()
  }, [])

  const cargarDonaciones = async () => {
    try {
      setLoading(true)
      setError(null)
      const datos = await obtenerDonaciones()
      setDonaciones(datos)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar donaciones:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta donación?')) return

    try {
      await eliminarDonacion(id)
      setDonaciones(donaciones.filter(d => d.id !== id))
      alert('Donación eliminada correctamente')
    } catch (err) {
      alert(`Error al eliminar: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error al cargar donaciones: {error}
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Donaciones Registradas</h2>

      {donaciones.length === 0 ? (
        <p className="text-muted">No hay donaciones registradas</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Donante</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {donaciones.map(donacion => (
                <tr key={donacion.id}>
                  <td>{donacion.id}</td>
                  <td>{donacion.tipoRecurso}</td>
                  <td>{donacion.cantidad}</td>
                  <td>{donacion.nombreDonante}</td>
                  <td>
                    <span className={`badge bg-${getColorEstado(donacion.estado)}`}>
                      {donacion.estado}
                    </span>
                  </td>
                  <td>{new Date(donacion.fechaRegistro).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(donacion.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Helper para colorear estados
function getColorEstado(estado) {
  const colores = {
    'REGISTRADA': 'info',
    'ASIGNADA': 'warning',
    'ENVIADA': 'primary',
    'ENTREGADA': 'success',
    'CANCELADA': 'danger'
  }
  return colores[estado] || 'secondary'
}
