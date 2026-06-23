/**
 * Reglas de validación simples y reutilizables
 * Validaciones pragmáticas que cumplen los requerimientos
 */

export const validationRules = {
  // Validar nombre requerido
  nombre: (valor) => {
    if (!valor || !valor.trim()) {
      return 'El nombre es requerido'
    }
    return null
  },

  // Validar email requerido y formato básico
  email: (valor) => {
    if (!valor || !valor.trim()) {
      return 'El email es requerido'
    }
    if (!valor.includes('@') || !valor.includes('.')) {
      return 'Email inválido'
    }
    return null
  },

  // Validar cantidad positiva
  cantidad: (valor) => {
    const num = Number(valor)
    if (!valor || num <= 0) {
      return 'La cantidad debe ser mayor a 0'
    }
    return null
  },

  // Validar campo requerido genérico
  requerido: (valor, nombreCampo = 'Este campo') => {
    if (!valor || !valor.toString().trim()) {
      return `${nombreCampo} es requerido`
    }
    return null
  },

  // Validar número positivo
  numeroPositivo: (valor, nombreCampo = 'El valor') => {
    const num = Number(valor)
    if (!valor || num <= 0) {
      return `${nombreCampo} debe ser mayor a 0`
    }
    return null
  }
}
