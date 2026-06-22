import { useState } from 'react'
import axios from 'axios'

/**
 * Componente AdminLogin
 * Autentica usuarios administradores contra el BFF
 * 
 * TODO: Implementar endpoint /api/v1/auth/login en BFF
 * Este componente está listo para conectar con autenticación real
 */
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

  /**
   * Genera un token seguro (en desarrollo)
   * En producción, el token debería venir del backend
   */
  const generateSecureToken = () => {
    return `${Math.random().toString(36).substring(2)}-${Date.now()}-${Math.random().toString(36).substring(2)}`
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

      try {
        // Intenta autenticación con el BFF
        // Este endpoint debe ser implementado en el backend
        const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
          usuario: formData.usuario,
          contrasena: formData.contrasena
        }, {
          timeout: 5000
        })

        const adminData = {
          usuario: response.data.usuario,
          token: response.data.token,
          loginTime: new Date().toISOString()
        }

        localStorage.setItem('adminAuth', JSON.stringify(adminData))
        onLogin(adminData)
      } catch (bffError) {
        // Fallback en desarrollo si el endpoint no existe aún
        console.warn('Endpoint de autenticación no disponible. Usando modo demo.')
        
        // En desarrollo, aceptar cualquier entrada
        // Esto debe ser removido cuando el backend esté listo
        if (process.env.NODE_ENV === 'development') {
          const adminData = {
            usuario: formData.usuario,
            token: generateSecureToken(),
            loginTime: new Date().toISOString(),
            isDevelopment: true
          }

          localStorage.setItem('adminAuth', JSON.stringify(adminData))
          onLogin(adminData)
        } else {
          setError('Error en la autenticación. Contacate con el administrador.')
        }
      }
    } catch (err) {
      console.error('Error en login:', err)
      setError('Ocurrió un error inesperado. Intenta nuevamente.')
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
                    autoComplete="username"
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
                    autoComplete="current-password"
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

              <div className="alert alert-warning small" role="alert">
                <strong>⚠️ Nota:</strong><br />
                En desarrollo, cualquier credencial funciona.
                El sistema está listo para integrar autenticación real cuando el backend esté disponible.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
