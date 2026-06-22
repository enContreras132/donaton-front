import { useState } from 'react'
import DonacionAlimento from './donaciones/DonacionAlimento'
import DonacionRopa from './donaciones/DonacionRopa'
import DonacionAgua from './donaciones/DonacionAgua'
import DonacionInsumoMedico from './donaciones/DonacionInsumoMedico'
import DonacionHigiene from './donaciones/DonacionHigiene'
import DonacionOtro from './donaciones/DonacionOtro'

export default function Donacion() {
  const [tipoDonaacionActivo, setTipoDonaacionActivo] = useState('alimento')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    const monto = formData.monto === 'custom'
      ? formData.montoCustom
      : formData.monto

    if (!monto || Number(monto) <= 0) {
      newErrors.monto = 'Ingresa un monto válido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setMensaje('')

      const monto = formData.monto === 'custom'
        ? formData.montoCustom
        : formData.monto

      const mapTipoRecurso = {
        dinero: 'DINERO',
        alimentos: 'ALIMENTO',
        agua: 'AGUA',
        ropa: 'ROPA',
        medicamentos: 'MEDICAMENTO'
      }

      const donacion = {
        tipoRecurso: mapTipoRecurso[formData.tipoRecurso],
        detalleRecurso: formData.mensaje || `Donación de ${formData.tipoRecurso}`,
        cantidad: Number(monto),
        origen: formData.metodoPago,
        nombreDonante: formData.nombre,
        contactoDonante: formData.email,
        centroAcopioId: null,
        necesidadId: formData.necesidadId ? Number(formData.necesidadId) : null
      }

      await crearDonacion(donacion)

      setMensaje('¡Donación registrada correctamente!')
      setFormData({
        nombre: '',
        email: '',
        monto: '50',
        montoCustom: '',
        metodoPago: 'tarjeta',
        mensaje: '',
        tipoRecurso: 'dinero',
        necesidadId: ''
      })
    } catch (error) {
      console.error(error)
      setMensaje('No se pudo confirmar la respuesta, pero revisa si la donación fue registrada.')
    } finally {
      setLoading(false)
    }
  }
  const tiposdonacion = [
    {
      id: 'alimento',
      titulo: 'Alimento',
      icono: '🍎',
      componente: DonacionAlimento
    },
    {
      id: 'ropa',
      titulo: 'Ropa',
      icono: '👕',
      componente: DonacionRopa
    },
    {
      id: 'agua',
      titulo: 'Agua',
      icono: '💧',
      componente: DonacionAgua
    },
    {
      id: 'insumo_medico',
      titulo: 'Insumo Médico',
      icono: '⚕️',
      componente: DonacionInsumoMedico
    },
    {
      id: 'higiene',
      titulo: 'Higiene',
      icono: '🧼',
      componente: DonacionHigiene
    },
    {
      id: 'otro',
      titulo: 'Otro',
      icono: '📦',
      componente: DonacionOtro
    }
  ]

  const tipoActual = tiposdonacion.find(tipo => tipo.id === tipoDonaacionActivo)
  const ComponenteActivo = tipoActual?.componente

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-2">Realizar Donación</h2>
              <p className="text-muted">Tu apoyo hace la diferencia. Selecciona el tipo de donación.</p>
            </div>

            {/* Tabs de tipos de donación */}
            <div className="mb-4">
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                {tiposdonacion.map((tipo) => (
                  <button
                    key={tipo.id}
                    className={`btn ${tipoDonaacionActivo === tipo.id ? 'btn-dark' : 'btn-outline-dark'}`}
                    onClick={() => setTipoDonaacionActivo(tipo.id)}
                    style={{
                      minWidth: '120px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <span style={{ marginRight: '0.5rem' }}>{tipo.icono}</span>
                    {tipo.titulo}
                  </button>
                ))}
              </div>
            </div>

            {/* Componente dinámico */}
            {ComponenteActivo && (
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <ComponenteActivo />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
