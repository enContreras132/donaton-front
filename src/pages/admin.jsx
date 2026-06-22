import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarDonaciones, actualizarDonacion, eliminarDonacion } from '../services/apiService'
import AdminLogin from '../components/AdminLogin'

export default function Admin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [donacionEditando, setDonacionEditando] = useState(null)
  const [formEdit, setFormEdit] = useState({})
  const [busqueda, setBusqueda] = useState('')

  // Estados de donaciones
  const estadosDonacion = ['REGISTRADA', 'VERIFICADA', 'ENTREGADA', 'RECHAZADA']
  const tiposRecurso = ['alimento', 'ropa', 'agua', 'insumo_medico', 'higiene', 'otro', 'dinero']

  // Verificar autenticación al cargar
  useEffect(() => {
    const authData = localStorage.getItem('adminAuth')
    if (authData) {
      const admin = JSON.parse(authData)
      setAdminUser(admin)
      setIsAuthenticated(true)
      cargarDonaciones()
    }
  }, [])

  const handleLogin = (userData) => {
    setAdminUser(userData)
    setIsAuthenticated(true)
    cargarDonaciones()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setAdminUser(null)
    setDonaciones([])
    setDonacionEditando(null)
  }

  const cargarDonaciones = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listarDonaciones()
      setDonaciones(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar las donaciones: ' + err.message)
      setDonaciones([])
    } finally {
      setLoading(false)
    }
  }

  const donacionesFiltradas = donaciones.filter(donacion => {
    const cumpleFiltro = filtro === 'todos' || donacion.estado === filtro
    const cumpleBusqueda = !busqueda || 
      donacion.id?.toString().includes(busqueda) ||
      donacion.tipoRecurso?.toLowerCase().includes(busqueda.toLowerCase()) ||
      donacion.detalles?.donador?.toLowerCase().includes(busqueda.toLowerCase())
    return cumpleFiltro && cumpleBusqueda
  })

  const abrirEdicion = (donacion) => {
    setDonacionEditando(donacion.id)
    setFormEdit({ ...donacion })
  }

  const cerrarEdicion = () => {
    setDonacionEditando(null)
    setFormEdit({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setFormEdit(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const guardarEdicion = async (id) => {
    try {
      setLoading(true)
      setError('')
      await actualizarDonacion(id, formEdit)
      // Actualizar en la lista local
      setDonaciones(prev => prev.map(d => d.id === id ? formEdit : d))
      cerrarEdicion()
      // Mostrar confirmación
      alert('Donación actualizada correctamente')
    } catch (err) {
      setError('Error al actualizar: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta donación?')) {
      try {
        setLoading(true)
        setError('')
        await eliminarDonacion(id)
        setDonaciones(prev => prev.filter(d => d.id !== id))
        alert('Donación eliminada correctamente')
      } catch (err) {
        setError('Error al eliminar: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  // Vista de login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  // Vista de admin
  return (
    <section className="py-5 bg-light" style={{ minHeight: '100vh' }}>
      <div className="container-fluid">
        {/* Header del Admin */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold mb-1">📊 Panel Administrativo</h1>
                <p className="text-muted">Bienvenido, {adminUser?.usuario}</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="text-primary">{donaciones.length}</h3>
                <p className="text-muted mb-0">Total de donaciones</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="text-success">{donaciones.filter(d => d.estado === 'ENTREGADA').length}</h3>
                <p className="text-muted mb-0">Entregadas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="text-info">{donaciones.filter(d => d.estado === 'VERIFICADA').length}</h3>
                <p className="text-muted mb-0">Verificadas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h3 className="text-warning">{donaciones.filter(d => d.estado === 'REGISTRADA').length}</h3>
                <p className="text-muted mb-0">Registradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de filtro y búsqueda */}
        <div className="row mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, tipo de recurso o donador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              {estadosDonacion.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de donaciones */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">Gestión de Donaciones ({donacionesFiltradas.length})</h5>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : donacionesFiltradas.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No hay donaciones para mostrar
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Tipo</th>
                          <th>Cantidad</th>
                          <th>Donador</th>
                          <th>Email</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donacionesFiltradas.map(donacion => (
                          <tr key={donacion.id}>
                            <td className="fw-semibold">#{donacion.id}</td>
                            <td>
                              <span className="badge bg-secondary">
                                {donacion.tipoRecurso}
                              </span>
                            </td>
                            <td>{donacion.cantidad} {donacion.unidad}</td>
                            <td>{donacion.detalles?.donador || 'N/A'}</td>
                            <td className="small text-muted">{donacion.detalles?.email || 'N/A'}</td>
                            <td>
                              {donacionEditando === donacion.id ? (
                                <select
                                  className="form-select form-select-sm"
                                  name="estado"
                                  value={formEdit.estado}
                                  onChange={handleEditChange}
                                >
                                  {estadosDonacion.map(estado => (
                                    <option key={estado} value={estado}>{estado}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className={`badge ${
                                  donacion.estado === 'ENTREGADA' ? 'bg-success' :
                                  donacion.estado === 'VERIFICADA' ? 'bg-info' :
                                  donacion.estado === 'REGISTRADA' ? 'bg-warning text-dark' :
                                  'bg-danger'
                                }`}>
                                  {donacion.estado}
                                </span>
                              )}
                            </td>
                            <td>
                              {donacionEditando === donacion.id ? (
                                <div className="btn-group btn-group-sm" role="group">
                                  <button
                                    className="btn btn-success"
                                    onClick={() => guardarEdicion(donacion.id)}
                                    disabled={loading}
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    className="btn btn-secondary"
                                    onClick={cerrarEdicion}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <div className="btn-group btn-group-sm" role="group">
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => abrirEdicion(donacion)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleEliminar(donacion.id)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal/Panel de edición detallada */}
        {donacionEditando && (
          <div className="row mt-4">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">Editar Donación #{donacionEditando}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Tipo de Recurso</label>
                      <select
                        className="form-select"
                        name="tipoRecurso"
                        value={formEdit.tipoRecurso}
                        onChange={handleEditChange}
                      >
                        {tiposRecurso.map(tipo => (
                          <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        name="cantidad"
                        value={formEdit.cantidad}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Unidad</label>
                      <input
                        type="text"
                        className="form-control"
                        name="unidad"
                        value={formEdit.unidad}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Estado</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={formEdit.estado}
                        onChange={handleEditChange}
                      >
                        {estadosDonacion.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Notas / Observaciones</label>
                      <textarea
                        className="form-control"
                        name="notas"
                        value={formEdit.notas || ''}
                        onChange={handleEditChange}
                        rows="3"
                        placeholder="Añade notas sobre esta donación..."
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={() => guardarEdicion(donacionEditando)}
                      disabled={loading}
                    >
                      Guardar cambios
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={cerrarEdicion}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
