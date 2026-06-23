import { useState, useCallback } from 'react'
import { validationRules } from './validationRules'

/**
 * Hook personalizado para validar formularios
 * Uso:
 * const { errors, validate, clearErrors } = useFormValidation()
 * 
 * // En handleSubmit:
 * if (validate({ nombre: formData.nombre, email: formData.email, cantidad })) {
 *   // Proceder con envío
 * }
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState({})

  /**
   * Valida un objeto de datos contra reglas específicas
   * @param {Object} data - Datos a validar
   * @param {Object} fieldsToValidate - Configuración de validaciones
   *   Ejemplo: {
   *     nombre: 'nombre',
   *     email: 'email',
   *     cantidad: 'cantidad'
   *   }
   * @returns {boolean} true si no hay errores, false si hay errores
   */
  const validate = useCallback((data, fieldsToValidate) => {
    const newErrors = {}

    // Si no hay configuración de campos, valida automáticamente
    if (!fieldsToValidate) {
      // Intenta validar campos comunes
      if (data.nombre !== undefined) {
        const errorNombre = validationRules.nombre(data.nombre)
        if (errorNombre) newErrors.nombre = errorNombre
      }
      if (data.email !== undefined) {
        const errorEmail = validationRules.email(data.email)
        if (errorEmail) newErrors.email = errorEmail
      }
      if (data.cantidad !== undefined) {
        const errorCantidad = validationRules.cantidad(data.cantidad)
        if (errorCantidad) newErrors.cantidad = errorCantidad
      }
    } else {
      // Valida según configuración específica
      Object.keys(fieldsToValidate).forEach((field) => {
        const rule = fieldsToValidate[field]
        const valor = data[field]

        if (rule === 'nombre') {
          const error = validationRules.nombre(valor)
          if (error) newErrors[field] = error
        } else if (rule === 'email') {
          const error = validationRules.email(valor)
          if (error) newErrors[field] = error
        } else if (rule === 'cantidad') {
          const error = validationRules.cantidad(valor)
          if (error) newErrors[field] = error
        } else if (rule === 'requerido') {
          const error = validationRules.requerido(valor, field)
          if (error) newErrors[field] = error
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [])

  /**
   * Limpia todos los errores
   */
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  /**
   * Limpia un error específico
   */
  const clearError = useCallback((fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  return {
    errors,
    validate,
    clearErrors,
    clearError
  }
}
