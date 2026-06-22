import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/header'
import Footer from '../components/footer'

export default function Login() {
  const navigate = useNavigate()
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
        // Intenta autenticación con el API Gateway
        const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
          usuario: formData.usuario,
          contrasena: formData.contrasena
        }, {
          timeout: 5000
        })

        const userData = {
          usuario: response.data.usuario,
          token: response.data.token,
          rol: response.data.rol || 'usuario', // El backend debe enviar el rol
          loginTime: new Date().toISOString()
        }

        // Guardar en localStorage según el rol
        if (userData.rol === 'admin') {
          localStorage.setItem('adminAuth', JSON.stringify(userData))
          navigate('/admin')
        } else {
          localStorage.setItem('userAuth', JSON.stringify(userData))
          navigate('/')
        }
      } catch (bffError) {
        // Fallback en desarrollo si el endpoint no existe aún
        console.warn('Endpoint de autenticación no disponible. Usando modo demo.')
        
        if (process.env.NODE_ENV === 'development') {
          // En desarrollo, detectar si es admin por el usuario
          const isAdmin = formData.usuario.toLowerCase().includes('admin')
          
          const userData = {
            usuario: formData.usuario,
            token: generateSecureToken(),
            rol: isAdmin ? 'admin' : 'usuario',
            loginTime: new Date().toISOString(),
            isDevelopment: true
          }

          if (isAdmin) {
            localStorage.setItem('adminAuth', JSON.stringify(userData))
            navigate('/admin')
          } else {
            localStorage.setItem('userAuth', JSON.stringify(userData))
            navigate('/')
          }
        } else {
          setError('Error en la autenticación. Contáctate con el administrador.')
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
    <>
      <Header />
      <section className="py-5 bg-light" style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <div className="shadow rounded p-5" style={{ backgroundColor: '#fff' }}>
                <h2 className="text-center fw-bold mb-4">Inicia sesión</h2>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">
                      Usuario
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      placeholder="Ingresa tu usuario"
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="contrasena"
                      name="contrasena"
                      value={formData.contrasena}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña"
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
