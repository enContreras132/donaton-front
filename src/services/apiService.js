const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `Error ${response.status}`)
  }
  return response.json()
}

export const crearDonacion = async (donacion) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/donaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donacion)
  })
  return handleResponse(response)
}

export const listarDonaciones = async () => {
  const response = await fetch(`${API_GATEWAY_URL}/api/donaciones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

export const crearNecesidad = async (necesidad) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/necesidades`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(necesidad)
  })
  return handleResponse(response)
}

export const listarNecesidades = async () => {
  const response = await fetch(`${API_GATEWAY_URL}/api/necesidades`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

export const obtenerNecesidad = async (id) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/necesidades/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

export const obtenerDonacion = async (id) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/donaciones/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

export const actualizarDonacion = async (id, donacion) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/donaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(donacion)
  })
  return handleResponse(response)
}

export const eliminarDonacion = async (id) => {
  const response = await fetch(`${API_GATEWAY_URL}/api/donaciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}
