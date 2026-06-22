import apiClient from './axiosConfig'

/**
 * Servicio de Donaciones
 * Consume los endpoints del microservicio de Donaciones
 */

// GET - Obtener todas las donaciones
export const obtenerDonaciones = async () => {
  try {
    return await apiClient.get('/donaciones')
  } catch (error) {
    console.error('Error al obtener donaciones:', error.message)
    throw error
  }
}

// GET - Obtener donación por ID
export const obtenerDonacionPorId = async (id) => {
  try {
    return await apiClient.get(`/donaciones/${id}`)
  } catch (error) {
    console.error(`Error al obtener donación ${id}:`, error.message)
    throw error
  }
}

// POST - Crear nueva donación
export const crearDonacion = async (donacion) => {
  try {
    return await apiClient.post('/donaciones', donacion)
  } catch (error) {
    console.error('Error al crear donación:', error.message)
    throw error
  }
}

// PUT - Actualizar donación
export const actualizarDonacion = async (id, donacion) => {
  try {
    return await apiClient.put(`/donaciones/${id}`, donacion)
  } catch (error) {
    console.error(`Error al actualizar donación ${id}:`, error.message)
    throw error
  }
}

// DELETE - Eliminar donación
export const eliminarDonacion = async (id) => {
  try {
    return await apiClient.delete(`/donaciones/${id}`)
  } catch (error) {
    console.error(`Error al eliminar donación ${id}:`, error.message)
    throw error
  }
}

// GET - Obtener donaciones por estado
export const obtenerDonacionesPorEstado = async (estado) => {
  try {
    return await apiClient.get(`/donaciones/estado/${estado}`)
  } catch (error) {
    console.error(`Error al obtener donaciones por estado ${estado}:`, error.message)
    throw error
  }
}

// GET - Obtener donaciones por tipo de recurso
export const obtenerDonacionesPorTipo = async (tipo) => {
  try {
    return await apiClient.get(`/donaciones/tipo/${tipo}`)
  } catch (error) {
    console.error(`Error al obtener donaciones por tipo ${tipo}:`, error.message)
    throw error
  }
}

// PATCH - Cambiar estado de donación
export const cambiarEstadoDonacion = async (id, estado) => {
  try {
    return await apiClient.patch(`/donaciones/${id}/estado/${estado}`)
  } catch (error) {
    console.error(`Error al cambiar estado de donación ${id}:`, error.message)
    throw error
  }
}
