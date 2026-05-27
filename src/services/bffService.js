const API_BFF = import.meta.env.VITE_BFF_URL || 'http://localhost:8080/api/v1'

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BFF}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || 'Error al comunicarse con el BFF')
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()
  if (!text) {
    return null
  }

  return JSON.parse(text)
}

export const crearDonacion = (donacion) => {
  return request('/donaciones', {
    method: 'POST',
    body: JSON.stringify(donacion)
  })
}

export const crearNecesidad = (necesidad) => {
  return request('/necesidades', {
    method: 'POST',
    body: JSON.stringify(necesidad)
  })
}

export const listarDonaciones = () => request('/donaciones')

export const listarNecesidades = () => request('/necesidades')

export const obtenerDetalleDonacion = (id) => request(`/donaciones/${id}/detalle`)

export const obtenerDetalleDistribucion = (id) => request(`/distribuciones/${id}/detalle`)
