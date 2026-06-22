import axios from 'axios'

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'
const API_V1_BASE = import.meta.env.VITE_API_V1_BASE || '/api/v1'

// Crear instancia de axios configurada
const apiClient = axios.create({
  baseURL: `${API_GATEWAY_URL}${API_V1_BASE}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response.data, // Retornar solo los datos
  (error) => {
    if (error.response) {
      // Error de la API (4xx, 5xx)
      const mensaje = error.response.data?.message || error.response.statusText || 'Error en la solicitud'
      console.error(`Error ${error.response.status}:`, mensaje)
      throw new Error(mensaje)
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error('Error: No hay respuesta del servidor')
      throw new Error('No hay conexión con el servidor')
    } else {
      // Error al configurar la solicitud
      console.error('Error:', error.message)
      throw new Error(error.message || 'Error desconocido')
    }
  }
)

export default apiClient
