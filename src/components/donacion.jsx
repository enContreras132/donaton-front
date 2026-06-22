import { useState } from 'react'
import DonacionAlimento from './donaciones/DonacionAlimento'
import DonacionRopa from './donaciones/DonacionRopa'
import DonacionAgua from './donaciones/DonacionAgua'
import DonacionInsumoMedico from './donaciones/DonacionInsumoMedico'
import DonacionHigiene from './donaciones/DonacionHigiene'
import DonacionOtro from './donaciones/DonacionOtro'

/**
 * Componente contenedor para las donaciones
 * Gestiona la selección del tipo de donación y renderiza el componente correspondiente
 */
export default function Donacion() {
  const [tipoDonaacionActivo, setTipoDonaacionActivo] = useState('alimento')
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
