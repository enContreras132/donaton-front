import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarDonaciones, actualizarDonacion, eliminarDonacion } from '../services/apiService'
import {
  obtenerNecesidades,
  actualizarNecesidad,
  eliminarNecesidad,
  cambiarEstadoNecesidad
} from '../services/necesidadesService'
import {
  obtenerCentrosAcopio,
  actualizarCentroAcopio,
  eliminarCentroAcopio,
  cambiarEstadoCentroAcopio
} from '../services/logisticaService'
import AdminLogin from '../components/AdminLogin'

const TAB_DONACIONES = 'donaciones'
const TAB_NECESIDADES = 'necesidades'
const TAB_CENTROS = 'centros'

const ESTADOS_DONACION = ['REGISTRADA', 'ASIGNADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA']
const TIPOS_RECURSO = ['ALIMENTO', 'ROPA', 'AGUA', 'INSUMO_MEDICO', 'HIGIENE', 'OTRO']
const ESTADOS_NECESIDAD = ['PENDIENTE', 'EN_PROCESO', 'CUBIERTA', 'CANCELADA']
const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE']

export default function Admin() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [tab, setTab] = useState(TAB_DONACIONES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Donaciones state
  const [donaciones, setDonaciones] = useState([])
  const [filtroDonacion, setFiltroDonacion] = useState('todos')
  const [busquedaDonacion, setBusquedaDonacion] = useState('')
  const [donacionEditando, setDonacionEditando] = useState(null)
  const [formEditDonacion, setFormEditDonacion] = useState({})

  // Necesidades state
  const [necesidades, setNecesidades] = useState([])
  const [filtroNecesidad, setFiltroNecesidad] = useState('todos')
  const [busquedaNecesidad, setBusquedaNecesidad] = useState('')
  const [necesidadEditando, setNecesidadEditando] = useState(null)
  const [formEditNecesidad, setFormEditNecesidad] = useState({})

  // Centros de acopio state
  const [centros, setCentros] = useState([])
  const [filtroCentro, setFiltroCentro] = useState('todos')
  const [busquedaCentro, setBusquedaCentro] = useState('')
  const [centroEditando, setCentroEditando] = useState(null)
  const [formEditCentro, setFormEditCentro] = useState({})

  useEffect(() => {
    const authData = localStorage.getItem('adminAuth')
    if (authData) {
      const admin = JSON.parse(authData)
      setAdminUser(admin)
      setIsAuthenticated(true)
      cargarDonaciones()
      cargarNecesidades()
      cargarCentros()
    }
  }, [])

  const handleLogin = (userData) => {
    setAdminUser(userData)
    setIsAuthenticated(true)
    cargarDonaciones()
    cargarNecesidades()
    cargarCentros()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
    setAdminUser(null)
    setDonaciones([])
    setNecesidades([])
    setCentros([])
    navigate('/')
  }

  // ========== DONACIONES ==========

  const cargarDonaciones = async () => {
    try {
      setLoading(true)
      const data = await listarDonaciones()
      setDonaciones(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar donaciones: ' + err.message)
      setDonaciones([])
    } finally {
      setLoading(false)
    }
  }

  const donacionesFiltradas = donaciones.filter(d => {
    const cumpleFiltro = filtroDonacion === 'todos' || d.estado === filtroDonacion
    const q = busquedaDonacion.toLowerCase()
    const cumpleBusqueda = !busquedaDonacion ||
      d.id?.toString().includes(q) ||
      d.tipoRecurso?.toLowerCase().includes(q) ||
      (d.nombreDonante || '').toLowerCase().includes(q)
    return cumpleFiltro && cumpleBusqueda
  })

  const abrirEdicionDonacion = (donacion) => {
    setDonacionEditando(donacion.id)
    setFormEditDonacion({ ...donacion })
  }

  const cerrarEdicionDonacion = () => {
    setDonacionEditando(null)
    setFormEditDonacion({})
  }

  const handleEditDonacionChange = (e) => {
    const { name, value } = e.target
    setFormEditDonacion(prev => ({ ...prev, [name]: value }))
  }

  const guardarEdicionDonacion = async (id) => {
    try {
      setLoading(true)
      setError('')
      await actualizarDonacion(id, formEditDonacion)
      setDonaciones(prev => prev.map(d => d.id === id ? { ...formEditDonacion, id } : d))
      cerrarEdicionDonacion()
      alert('Donacion actualizada correctamente')
    } catch (err) {
      setError('Error al actualizar donacion: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarDonacion = async (id) => {
    if (!confirm('Seguro de eliminar esta donacion?')) return
    try {
      setLoading(true)
      setError('')
      await eliminarDonacion(id)
      setDonaciones(prev => prev.filter(d => d.id !== id))
      alert('Donacion eliminada correctamente')
    } catch (err) {
      setError('Error al eliminar donacion: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // ========== NECESIDADES ==========

  const cargarNecesidades = async () => {
    try {
      setLoading(true)
      const data = await obtenerNecesidades()
      setNecesidades(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar necesidades: ' + err.message)
      setNecesidades([])
    } finally {
      setLoading(false)
    }
  }

  const cargarCentros = async () => {
    try {
      setLoading(true)
      const data = await obtenerCentrosAcopio()
      setCentros(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Error al cargar centros de acopio: ' + err.message)
      setCentros([])
    } finally {
      setLoading(false)
    }
  }

  const necesidadesFiltradas = necesidades.filter(n => {
    const cumpleFiltro = filtroNecesidad === 'todos' || n.estado === filtroNecesidad
    const q = busquedaNecesidad.toLowerCase()
    const cumpleBusqueda = !busquedaNecesidad ||
      n.id?.toString().includes(q) ||
      (n.recursoNecesitado || '').toLowerCase().includes(q) ||
      (n.ubicacion || '').toLowerCase().includes(q)
    return cumpleFiltro && cumpleBusqueda
  })

  const abrirEdicionNecesidad = (necesidad) => {
    setNecesidadEditando(necesidad.id)
    setFormEditNecesidad({ ...necesidad })
  }

  const cerrarEdicionNecesidad = () => {
    setNecesidadEditando(null)
    setFormEditNecesidad({})
  }

  const handleEditNecesidadChange = (e) => {
    const { name, value } = e.target
    setFormEditNecesidad(prev => ({ ...prev, [name]: value }))
  }

  const guardarEdicionNecesidad = async (id) => {
    try {
      setLoading(true)
      setError('')
      const payload = {
        recursoNecesitado: formEditNecesidad.recursoNecesitado,
        cantidad: Number(formEditNecesidad.cantidad),
        ubicacion: formEditNecesidad.ubicacion,
        descripcion: formEditNecesidad.descripcion || '',
        prioridad: formEditNecesidad.prioridad
      }
      await actualizarNecesidad(id, payload)
      setNecesidades(prev => prev.map(n => n.id === id ? { ...formEditNecesidad, id } : n))
      cerrarEdicionNecesidad()
      alert('Necesidad actualizada correctamente')
    } catch (err) {
      setError('Error al actualizar necesidad: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarNecesidad = async (id) => {
    if (!confirm('Seguro de eliminar esta necesidad?')) return
    try {
      setLoading(true)
      setError('')
      await eliminarNecesidad(id)
      setNecesidades(prev => prev.filter(n => n.id !== id))
      alert('Necesidad eliminada correctamente')
    } catch (err) {
      setError('Error al eliminar necesidad: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCambiarEstadoNecesidad = async (id, estado) => {
    try {
      setLoading(true)
      setError('')
      await cambiarEstadoNecesidad(id, estado)
      setNecesidades(prev => prev.map(n => n.id === id ? { ...n, estado } : n))
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const centrosFiltrados = centros.filter(c => {
    const cumpleFiltro = filtroCentro === 'todos' ||
      (filtroCentro === 'activos' && c.activo) ||
      (filtroCentro === 'inactivos' && !c.activo)
    const q = busquedaCentro.toLowerCase()
    const cumpleBusqueda = !busquedaCentro ||
      c.id?.toString().includes(q) ||
      (c.nombre || '').toLowerCase().includes(q) ||
      (c.comuna || '').toLowerCase().includes(q)
    return cumpleFiltro && cumpleBusqueda
  })

  const abrirEdicionCentro = (centro) => {
    setCentroEditando(centro.id)
    setFormEditCentro({ ...centro })
  }

  const cerrarEdicionCentro = () => {
    setCentroEditando(null)
    setFormEditCentro({})
  }

  const handleEditCentroChange = (e) => {
    const { name, value } = e.target
    setFormEditCentro(prev => ({ ...prev, [name]: value }))
  }

  const guardarEdicionCentro = async (id) => {
    try {
      setLoading(true)
      setError('')
      const payload = {
        nombre: formEditCentro.nombre,
        direccion: formEditCentro.direccion,
        comuna: formEditCentro.comuna,
        capacidadMaxima: Number(formEditCentro.capacidadMaxima),
        responsable: formEditCentro.responsable || '',
        telefono: formEditCentro.telefono || ''
      }
      await actualizarCentroAcopio(id, payload)
      setCentros(prev => prev.map(c => c.id === id ? { ...formEditCentro, id } : c))
      cerrarEdicionCentro()
      alert('Centro de acopio actualizado correctamente')
    } catch (err) {
      setError('Error al actualizar centro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarCentro = async (id) => {
    if (!confirm('Seguro de eliminar este centro de acopio?')) return
    try {
      setLoading(true)
      setError('')
      await eliminarCentroAcopio(id)
      setCentros(prev => prev.filter(c => c.id !== id))
      alert('Centro de acopio eliminado correctamente')
    } catch (err) {
      setError('Error al eliminar centro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActivo = async (id, activo) => {
    try {
      setLoading(true)
      setError('')
      await cambiarEstadoCentroAcopio(id, !activo)
      setCentros(prev => prev.map(c => c.id === id ? { ...c, activo: !activo } : c))
    } catch (err) {
      setError('Error al cambiar estado: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // ========== RENDER ==========

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const renderSpinner = () => (
    <div className="p-4 text-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  )

  const renderError = () => error && (
    <div className="row mb-4">
      <div className="col-12">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    </div>
  )

  return (
    <section className="py-5 bg-light" style={{ minHeight: '100vh' }}>
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold mb-1">Panel Administrativo</h1>
                <p className="text-muted">Bienvenido, {adminUser?.usuario}</p>
              </div>
              <button onClick={handleLogout} className="btn btn-outline-danger">Cerrar sesion</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${tab === TAB_DONACIONES ? 'active fw-bold' : ''}`}
                  onClick={() => setTab(TAB_DONACIONES)}
                >
                  Donaciones
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tab === TAB_NECESIDADES ? 'active fw-bold' : ''}`}
                  onClick={() => setTab(TAB_NECESIDADES)}
                >
                  Necesidades
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${tab === TAB_CENTROS ? 'active fw-bold' : ''}`}
                  onClick={() => setTab(TAB_CENTROS)}
                >
                  Centros de Acopio
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Donaciones Tab */}
        {tab === TAB_DONACIONES && (
          <>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-primary">{donaciones.length}</h3>
                    <p className="text-muted mb-0">Total donaciones</p>
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
                    <h3 className="text-warning">{donaciones.filter(d => d.estado === 'REGISTRADA').length}</h3>
                    <p className="text-muted mb-0">Registradas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-info">{donaciones.filter(d => d.estado === 'ASIGNADA').length}</h3>
                    <p className="text-muted mb-0">Asignadas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Buscar por ID, tipo o donador..."
                  value={busquedaDonacion} onChange={(e) => setBusquedaDonacion(e.target.value)} />
              </div>
              <div className="col-md-6">
                <select className="form-select" value={filtroDonacion}
                  onChange={(e) => setFiltroDonacion(e.target.value)}>
                  <option value="todos">Todos los estados</option>
                  {ESTADOS_DONACION.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            {renderError()}

            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Gestion de Donaciones ({donacionesFiltradas.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    {loading ? renderSpinner() : donacionesFiltradas.length === 0 ? (
                      <div className="p-4 text-center text-muted">No hay donaciones para mostrar</div>
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
                            {donacionesFiltradas.map(d => (
                              <tr key={d.id}>
                                <td className="fw-semibold">#{d.id}</td>
                                <td><span className="badge bg-secondary">{d.tipoRecurso}</span></td>
                                <td>{d.cantidad}</td>
                                <td>{d.nombreDonante || 'N/A'}</td>
                                <td className="small text-muted">{d.contactoDonante || 'N/A'}</td>
                                <td>
                                  {donacionEditando === d.id ? (
                                    <select className="form-select form-select-sm" name="estado"
                                      value={formEditDonacion.estado} onChange={handleEditDonacionChange}>
                                      {ESTADOS_DONACION.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                  ) : (
                                    <span className={`badge ${
                                      d.estado === 'ENTREGADA' ? 'bg-success' :
                                      d.estado === 'ASIGNADA' ? 'bg-info' :
                                      d.estado === 'REGISTRADA' ? 'bg-warning text-dark' :
                                      d.estado === 'ENVIADA' ? 'bg-primary' :
                                      d.estado === 'CANCELADA' ? 'bg-secondary' : 'bg-danger'
                                    }`}>{d.estado}</span>
                                  )}
                                </td>
                                <td>
                                  {donacionEditando === d.id ? (
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-success" onClick={() => guardarEdicionDonacion(d.id)} disabled={loading}>Guardar</button>
                                      <button className="btn btn-secondary" onClick={cerrarEdicionDonacion}>Cancelar</button>
                                    </div>
                                  ) : (
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-primary" onClick={() => abrirEdicionDonacion(d)}>Editar</button>
                                      <button className="btn btn-danger" onClick={() => handleEliminarDonacion(d.id)}>Eliminar</button>
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

            {donacionEditando && (
              <div className="row mt-4">
                <div className="col-lg-8">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">Editar Donacion #{donacionEditando}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Tipo de Recurso</label>
                          <select className="form-select" name="tipoRecurso"
                            value={formEditDonacion.tipoRecurso} onChange={handleEditDonacionChange}>
                            {TIPOS_RECURSO.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Cantidad</label>
                          <input type="number" className="form-control" name="cantidad"
                            value={formEditDonacion.cantidad} onChange={handleEditDonacionChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Estado</label>
                          <select className="form-select" name="estado"
                            value={formEditDonacion.estado} onChange={handleEditDonacionChange}>
                            {ESTADOS_DONACION.map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={() => guardarEdicionDonacion(donacionEditando)} disabled={loading}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={cerrarEdicionDonacion}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Necesidades Tab */}
        {tab === TAB_NECESIDADES && (
          <>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-primary">{necesidades.length}</h3>
                    <p className="text-muted mb-0">Total necesidades</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-success">{necesidades.filter(n => n.estado === 'CUBIERTA').length}</h3>
                    <p className="text-muted mb-0">Cubiertas</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-warning">{necesidades.filter(n => n.estado === 'PENDIENTE').length}</h3>
                    <p className="text-muted mb-0">Pendientes</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-info">{necesidades.filter(n => n.estado === 'EN_PROCESO').length}</h3>
                    <p className="text-muted mb-0">En proceso</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Buscar por ID, recurso o ubicacion..."
                  value={busquedaNecesidad} onChange={(e) => setBusquedaNecesidad(e.target.value)} />
              </div>
              <div className="col-md-6">
                <select className="form-select" value={filtroNecesidad}
                  onChange={(e) => setFiltroNecesidad(e.target.value)}>
                  <option value="todos">Todos los estados</option>
                  {ESTADOS_NECESIDAD.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            {renderError()}

            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Gestion de Necesidades ({necesidadesFiltradas.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    {loading ? renderSpinner() : necesidadesFiltradas.length === 0 ? (
                      <div className="p-4 text-center text-muted">No hay necesidades para mostrar</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Recurso</th>
                              <th>Cantidad</th>
                              <th>Ubicacion</th>
                              <th>Prioridad</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {necesidadesFiltradas.map(n => (
                              <tr key={n.id}>
                                <td className="fw-semibold">#{n.id}</td>
                                <td>{n.recursoNecesitado}</td>
                                <td>{n.cantidad}</td>
                                <td className="small">{n.ubicacion}</td>
                                <td>
                                  <span className={`badge ${
                                    n.prioridad === 'URGENTE' ? 'bg-danger' :
                                    n.prioridad === 'ALTA' ? 'bg-warning text-dark' :
                                    n.prioridad === 'MEDIA' ? 'bg-info' : 'bg-secondary'
                                  }`}>{n.prioridad}</span>
                                </td>
                                <td>
                                  {necesidadEditando === n.id ? (
                                    <select className="form-select form-select-sm" name="estado"
                                      value={formEditNecesidad.estado} onChange={handleEditNecesidadChange}>
                                      {ESTADOS_NECESIDAD.map(e => <option key={e} value={e}>{e}</option>)}
                                    </select>
                                  ) : (
                                    <span className={`badge ${
                                      n.estado === 'CUBIERTA' ? 'bg-success' :
                                      n.estado === 'EN_PROCESO' ? 'bg-info' :
                                      n.estado === 'PENDIENTE' ? 'bg-warning text-dark' :
                                      n.estado === 'CANCELADA' ? 'bg-secondary' : 'bg-danger'
                                    }`}>{n.estado}</span>
                                  )}
                                </td>
                                <td>
                                  {necesidadEditando === n.id ? (
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-success" onClick={() => guardarEdicionNecesidad(n.id)} disabled={loading}>Guardar</button>
                                      <button className="btn btn-secondary" onClick={cerrarEdicionNecesidad}>Cancelar</button>
                                    </div>
                                  ) : (
                                    <div className="btn-group btn-group-sm">
                                      <button className="btn btn-primary" onClick={() => abrirEdicionNecesidad(n)}>Editar</button>
                                      <button className="btn btn-danger" onClick={() => handleEliminarNecesidad(n.id)}>Eliminar</button>
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

            {necesidadEditando && (
              <div className="row mt-4">
                <div className="col-lg-8">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">Editar Necesidad #{necesidadEditando}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Recurso Necesitado</label>
                          <input type="text" className="form-control" name="recursoNecesitado"
                            value={formEditNecesidad.recursoNecesitado || ''} onChange={handleEditNecesidadChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Cantidad</label>
                          <input type="number" className="form-control" name="cantidad"
                            value={formEditNecesidad.cantidad || ''} onChange={handleEditNecesidadChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Ubicacion</label>
                          <input type="text" className="form-control" name="ubicacion"
                            value={formEditNecesidad.ubicacion || ''} onChange={handleEditNecesidadChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Prioridad</label>
                          <select className="form-select" name="prioridad"
                            value={formEditNecesidad.prioridad || ''} onChange={handleEditNecesidadChange}>
                            {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div className="col-12 mb-3">
                          <label className="form-label fw-semibold">Descripcion</label>
                          <textarea className="form-control" name="descripcion" rows="3"
                            value={formEditNecesidad.descripcion || ''} onChange={handleEditNecesidadChange} />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={() => guardarEdicionNecesidad(necesidadEditando)} disabled={loading}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={cerrarEdicionNecesidad}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Centros de Acopio Tab */}
        {tab === TAB_CENTROS && (
          <>
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-primary">{centros.length}</h3>
                    <p className="text-muted mb-0">Total centros</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-success">{centros.filter(c => c.activo).length}</h3>
                    <p className="text-muted mb-0">Activos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-secondary">{centros.filter(c => !c.activo).length}</h3>
                    <p className="text-muted mb-0">Inactivos</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center">
                    <h3 className="text-info">{centros.reduce((sum, c) => sum + (c.capacidadMaxima || 0), 0)}</h3>
                    <p className="text-muted mb-0">Capacidad total</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <input type="text" className="form-control" placeholder="Buscar por ID, nombre o comuna..."
                  value={busquedaCentro} onChange={(e) => setBusquedaCentro(e.target.value)} />
              </div>
              <div className="col-md-6">
                <select className="form-select" value={filtroCentro}
                  onChange={(e) => setFiltroCentro(e.target.value)}>
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="inactivos">Inactivos</option>
                </select>
              </div>
            </div>

            {renderError()}

            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">Gestion de Centros de Acopio ({centrosFiltrados.length})</h5>
                  </div>
                  <div className="card-body p-0">
                    {loading ? renderSpinner() : centrosFiltrados.length === 0 ? (
                      <div className="p-4 text-center text-muted">No hay centros de acopio para mostrar</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover mb-0">
                          <thead className="table-light">
                            <tr>
                              <th>ID</th>
                              <th>Nombre</th>
                              <th>Direccion</th>
                              <th>Comuna</th>
                              <th>Capacidad</th>
                              <th>Responsable</th>
                              <th>Activo</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {centrosFiltrados.map(c => (
                              <tr key={c.id}>
                                <td className="fw-semibold">#{c.id}</td>
                                <td>{c.nombre}</td>
                                <td className="small">{c.direccion}</td>
                                <td>{c.comuna}</td>
                                <td>{c.capacidadMaxima}</td>
                                <td className="small">{c.responsable || 'N/A'}</td>
                                <td>
                                  {c.activo ? (
                                    <span className="badge bg-success">Activo</span>
                                  ) : (
                                    <span className="badge bg-secondary">Inactivo</span>
                                  )}
                                </td>
                                <td>
                                  <div className="btn-group btn-group-sm">
                                    <button className="btn btn-primary" onClick={() => abrirEdicionCentro(c)}>Editar</button>
                                    <button className={`btn ${c.activo ? 'btn-warning' : 'btn-success'}`}
                                      onClick={() => handleToggleActivo(c.id, c.activo)} disabled={loading}>
                                      {c.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleEliminarCentro(c.id)}>Eliminar</button>
                                  </div>
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

            {centroEditando && (
              <div className="row mt-4">
                <div className="col-lg-8">
                  <div className="card shadow-sm border-0">
                    <div className="card-header bg-info text-white">
                      <h5 className="mb-0">Editar Centro de Acopio #{centroEditando}</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Nombre</label>
                          <input type="text" className="form-control" name="nombre"
                            value={formEditCentro.nombre || ''} onChange={handleEditCentroChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Direccion</label>
                          <input type="text" className="form-control" name="direccion"
                            value={formEditCentro.direccion || ''} onChange={handleEditCentroChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Comuna</label>
                          <input type="text" className="form-control" name="comuna"
                            value={formEditCentro.comuna || ''} onChange={handleEditCentroChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Capacidad Maxima</label>
                          <input type="number" className="form-control" name="capacidadMaxima"
                            value={formEditCentro.capacidadMaxima || ''} onChange={handleEditCentroChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Responsable</label>
                          <input type="text" className="form-control" name="responsable"
                            value={formEditCentro.responsable || ''} onChange={handleEditCentroChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-semibold">Telefono</label>
                          <input type="text" className="form-control" name="telefono"
                            value={formEditCentro.telefono || ''} onChange={handleEditCentroChange} />
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-success" onClick={() => guardarEdicionCentro(centroEditando)} disabled={loading}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={cerrarEdicionCentro}>Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
