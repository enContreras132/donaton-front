import apiClient from './axiosConfig'

/**
 * Servicio de Logística
 * Consume los endpoints del microservicio de Logística
 */

// ========== ENVIOS ==========

// GET - Obtener todos los envios
export const obtenerEnvios = async () => {
  try {
    return await apiClient.get('/logistica/envios')
  } catch (error) {
    console.error('Error al obtener envios:', error.message)
    throw error
  }
}

// GET - Obtener envio por ID
export const obtenerEnvioPorId = async (id) => {
  try {
    return await apiClient.get(`/logistica/envios/${id}`)
  } catch (error) {
    console.error(`Error al obtener envio ${id}:`, error.message)
    throw error
  }
}

// POST - Crear nuevo envio
export const crearEnvio = async (envio) => {
  try {
    return await apiClient.post('/logistica/envios', envio)
  } catch (error) {
    console.error('Error al crear envio:', error.message)
    throw error
  }
}

// DELETE - Eliminar envio
export const eliminarEnvio = async (id) => {
  try {
    return await apiClient.delete(`/logistica/envios/${id}`)
  } catch (error) {
    console.error(`Error al eliminar envio ${id}:`, error.message)
    throw error
  }
}

// GET - Obtener envios por estado
export const obtenerEnviosPorEstado = async (estado) => {
  try {
    return await apiClient.get(`/logistica/envios/estado/${estado}`)
  } catch (error) {
    console.error(`Error al obtener envios por estado ${estado}:`, error.message)
    throw error
  }
}

// GET - Obtener envios por donación
export const obtenerEnviosPorDonacion = async (donacionId) => {
  try {
    return await apiClient.get(`/logistica/envios/donacion/${donacionId}`)
  } catch (error) {
    console.error(`Error al obtener envios para donación ${donacionId}:`, error.message)
    throw error
  }
}

// GET - Obtener envios por necesidad
export const obtenerEnviosPorNecesidad = async (necesidadId) => {
  try {
    return await apiClient.get(`/logistica/envios/necesidad/${necesidadId}`)
  } catch (error) {
    console.error(`Error al obtener envios para necesidad ${necesidadId}:`, error.message)
    throw error
  }
}

// PATCH - Cambiar estado de envio
export const cambiarEstadoEnvio = async (id, estado) => {
  try {
    return await apiClient.patch(`/logistica/envios/${id}/estado/${estado}`)
  } catch (error) {
    console.error(`Error al cambiar estado de envio ${id}:`, error.message)
    throw error
  }
}

// ========== CENTROS DE ACOPIO ==========

// GET - Obtener todos los centros de acopio
export const obtenerCentrosAcopio = async () => {
  try {
    return await apiClient.get('/logistica/centros-acopio')
  } catch (error) {
    console.error('Error al obtener centros de acopio:', error.message)
    throw error
  }
}

// GET - Obtener centros de acopio activos
export const obtenerCentrosAcopioActivos = async () => {
  try {
    return await apiClient.get('/logistica/centros-acopio/activos')
  } catch (error) {
    console.error('Error al obtener centros de acopio activos:', error.message)
    throw error
  }
}

// GET - Obtener centro de acopio por ID
export const obtenerCentroAcopioPorId = async (id) => {
  try {
    return await apiClient.get(`/logistica/centros-acopio/${id}`)
  } catch (error) {
    console.error(`Error al obtener centro de acopio ${id}:`, error.message)
    throw error
  }
}

// POST - Crear nuevo centro de acopio
export const crearCentroAcopio = async (centro) => {
  try {
    return await apiClient.post('/logistica/centros-acopio', centro)
  } catch (error) {
    console.error('Error al crear centro de acopio:', error.message)
    throw error
  }
}

// PUT - Actualizar centro de acopio
export const actualizarCentroAcopio = async (id, centro) => {
  try {
    return await apiClient.put(`/logistica/centros-acopio/${id}`, centro)
  } catch (error) {
    console.error(`Error al actualizar centro de acopio ${id}:`, error.message)
    throw error
  }
}

// DELETE - Eliminar centro de acopio
export const eliminarCentroAcopio = async (id) => {
  try {
    return await apiClient.delete(`/logistica/centros-acopio/${id}`)
  } catch (error) {
    console.error(`Error al eliminar centro de acopio ${id}:`, error.message)
    throw error
  }
}

// PATCH - Cambiar estado activo/inactivo de centro de acopio
export const cambiarEstadoCentroAcopio = async (id, activo) => {
  try {
    return await apiClient.patch(`/logistica/centros-acopio/${id}/activo/${activo}`)
  } catch (error) {
    console.error(`Error al cambiar estado de centro de acopio ${id}:`, error.message)
    throw error
  }
}
