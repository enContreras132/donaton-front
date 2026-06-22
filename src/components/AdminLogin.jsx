import { useState } from 'react'

export default function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.usuario.trim() || !formData.contrasena.trim()) {
      setError('Por favor completa todos los campos')
      return
    }

    try {
      setLoading(true)

      // Simulación de autenticación
      // En producción, esto debería hacer una llamada al backend
      if (formData.usuario === 'admin' && formData.contrasena === 'admin123') {
        const adminData = {
          usuario: formData.usuario,
          token: 'admin-token-' + Date.now(),
          loginTime: new Date().toISOString()
        }

        localStorage.setItem('adminAuth', JSON.stringify(adminData))
        onLogin(adminData)
      } else {
        setError('Usuario o contraseña incorrectos')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-5 bg-light" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
              <div className="text-center mb-4">
                <h1 style={{ fontSize: '2.5rem' }}>🔐</h1>
                <h2 className="fw-bold">Panel Administrativo</h2>
                <p className="text-muted">Ingresa tus credenciales</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label fw-semibold">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    placeholder="Ingresa tu usuario"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contrasena" className="form-label fw-semibold">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-dark w-100 py-2"
                  style={{ fontSize: '1rem' }}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>

              <hr className="my-4" />

              <div className="alert alert-info small" role="alert">
                <strong>Datos de prueba:</strong><br />
                Usuario: <code>admin</code><br />
                Contraseña: <code>admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
