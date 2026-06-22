import apiClient from './axiosConfig'

/**
 * Servicio de Necesidades
 * Consume los endpoints del microservicio de Necesidades
 */

// GET - Obtener todas las necesidades
export const obtenerNecesidades = async () => {
  try {
    return await apiClient.get('/necesidades')
  } catch (error) {
    console.error('Error al obtener necesidades:', error.message)
    throw error
  }
}

// GET - Obtener necesidad por ID
export const obtenerNecesidadPorId = async (id) => {
  try {
    return await apiClient.get(`/necesidades/${id}`)
  } catch (error) {
    console.error(`Error al obtener necesidad ${id}:`, error.message)
    throw error
  }
}

// POST - Crear nueva necesidad
export const crearNecesidad = async (necesidad) => {
  try {
    return await apiClient.post('/necesidades', necesidad)
  } catch (error) {
    console.error('Error al crear necesidad:', error.message)
    throw error
  }
}

// PUT - Actualizar necesidad
export const actualizarNecesidad = async (id, necesidad) => {
  try {
    return await apiClient.put(`/necesidades/${id}`, necesidad)
  } catch (error) {
    console.error(`Error al actualizar necesidad ${id}:`, error.message)
    throw error
  }
}

// DELETE - Eliminar necesidad
export const eliminarNecesidad = async (id) => {
  try {
    return await apiClient.delete(`/necesidades/${id}`)
  } catch (error) {
    console.error(`Error al eliminar necesidad ${id}:`, error.message)
    throw error
  }
}

// GET - Obtener necesidades por estado
export const obtenerNecesidadesPorEstado = async (estado) => {
  try {
    return await apiClient.get(`/necesidades/estado/${estado}`)
  } catch (error) {
    console.error(`Error al obtener necesidades por estado ${estado}:`, error.message)
    throw error
  }
}

// GET - Buscar necesidades por ubicación
export const buscarNecesidadesPorUbicacion = async (ubicacion) => {
  try {
    return await apiClient.get('/necesidades/ubicacion', {
      params: { valor: ubicacion }
    })
  } catch (error) {
    console.error(`Error al buscar necesidades en ${ubicacion}:`, error.message)
    throw error
  }
}

// PATCH - Cambiar estado de necesidad
export const cambiarEstadoNecesidad = async (id, estado) => {
  try {
    return await apiClient.patch(`/necesidades/${id}/estado/${estado}`)
  } catch (error) {
    console.error(`Error al cambiar estado de necesidad ${id}:`, error.message)
    throw error
  }
}
