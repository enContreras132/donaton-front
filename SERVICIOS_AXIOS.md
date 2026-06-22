# Frontend - Guía de Servicios con Axios

## 📋 Estructura de Servicios

El frontend está organizado para consumir los microservicios del backend mediante axios:

```
src/services/
├── axiosConfig.js              ← Configuración centralizada de axios
├── donacionesService.js        ← API de Donaciones
├── necesidadesService.js       ← API de Necesidades
└── logisticaService.js         ← API de Logística
```

## 🚀 Cómo Usar los Servicios

### 1. Servicio de Donaciones

```javascript
import {
  obtenerDonaciones,
  obtenerDonacionPorId,
  crearDonacion,
  actualizarDonacion,
  eliminarDonacion,
  obtenerDonacionesPorEstado,
  obtenerDonacionesPorTipo,
  cambiarEstadoDonacion
} from '../services/donacionesService'

// Obtener todas las donaciones
const donaciones = await obtenerDonaciones()

// Crear una nueva donación
const nuevaDonacion = {
  tipoRecurso: 'ALIMENTO',
  detalleRecurso: 'Arroz integral 5kg',
  cantidad: 50,
  origen: 'Mercado Central',
  nombreDonante: 'Juan Pérez',
  contactoDonante: 'juan@email.com'
}
const donacion = await crearDonacion(nuevaDonacion)

// Cambiar estado
await cambiarEstadoDonacion(1, 'ASIGNADA')

// Obtener por tipo
const alimentos = await obtenerDonacionesPorTipo('ALIMENTO')
```

### 2. Servicio de Necesidades

```javascript
import {
  obtenerNecesidades,
  obtenerNecesidadPorId,
  crearNecesidad,
  actualizarNecesidad,
  eliminarNecesidad,
  obtenerNecesidadesPorEstado,
  buscarNecesidadesPorUbicacion,
  cambiarEstadoNecesidad
} from '../services/necesidadesService'

// Obtener todas
const necesidades = await obtenerNecesidades()

// Crear una nueva
const nuevaNecesidad = {
  recursoNecesitado: 'Alimentos básicos',
  cantidad: 100,
  ubicacion: 'La Legua, Santiago',
  descripcion: 'Comunidad requiere alimentos para 200 personas',
  prioridad: 'URGENTE'
}
const necesidad = await crearNecesidad(nuevaNecesidad)

// Buscar por ubicación
const necesidadesLaLegua = await buscarNecesidadesPorUbicacion('La Legua')
```

### 3. Servicio de Logística

```javascript
import {
  obtenerEnvios,
  obtenerEnvioPorId,
  crearEnvio,
  eliminarEnvio,
  obtenerEnviosPorEstado,
  cambiarEstadoEnvio,
  obtenerCentrosAcopio,
  obtenerCentrosAcopioActivos,
  crearCentroAcopio
} from '../services/logisticaService'

// Envios
const envios = await obtenerEnvios()
const envioPlanificado = await obtenerEnviosPorEstado('PLANIFICADO')

// Cambiar estado
await cambiarEstadoEnvio(1, 'EN_TRANSITO')

// Centros de Acopio
const centros = await obtenerCentrosAcopio()
const centrosActivos = await obtenerCentrosAcopioActivos()

// Crear envio
const nuevoEnvio = {
  donacionId: 1,
  necesidadId: 1,
  centroAcopioId: 1,
  destino: 'La Legua',
  transporte: 'Camión'
}
const envio = await crearEnvio(nuevoEnvio)
```

## ⚙️ Configuración

### Variables de Entorno (.env.local)

```
VITE_API_GATEWAY_URL=http://localhost:8080
VITE_API_V1_BASE=/api/v1
```

### Instancia de Axios (axiosConfig.js)

La instancia está preconfigurada con:
- **Base URL**: `http://localhost:8080/api/v1`
- **Timeout**: 10 segundos
- **Headers**: `Content-Type: application/json`
- **Interceptores**: Manejo automático de errores

## 🔄 En un Componente React

```javascript
import { useState, useEffect } from 'react'
import { obtenerDonaciones } from '../services/donacionesService'

export default function MiComponente() {
  const [donaciones, setDonaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await obtenerDonaciones()
        setDonaciones(datos)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {donaciones.map(d => (
        <li key={d.id}>{d.tipoRecurso} - {d.cantidad}</li>
      ))}
    </ul>
  )
}
```

## 📝 Manejo de Errores

Todos los servicios lanzan excepciones que puedes capturar:

```javascript
try {
  const donacion = await crearDonacion(datos)
} catch (error) {
  console.error('Error:', error.message)
  // Error message ya viene procesado y es legible
}
```

## 🎯 Características de Axios

✅ Interceptores automáticos para errores
✅ Timeout configurable
✅ Manejo de CORS
✅ Retorna solo datos (sin necesidad de `.json()`)
✅ Mejor manejo de tipos que fetch

## 📚 Modelos de Datos

### Donación
```javascript
{
  tipoRecurso: 'ALIMENTO' | 'ROPA' | 'AGUA' | 'INSUMO_MEDICO' | 'HIGIENE' | 'OTRO',
  detalleRecurso: string,
  cantidad: number,
  origen: string,
  nombreDonante: string,
  contactoDonante: string,
  centroAcopioId?: number,
  necesidadId?: number,
  estado: 'REGISTRADA' | 'ASIGNADA' | 'ENVIADA' | 'ENTREGADA' | 'CANCELADA'
}
```

### Necesidad
```javascript
{
  recursoNecesitado: string,
  cantidad: number,
  ubicacion: string,
  descripcion: string,
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'CUBIERTA' | 'CANCELADA'
}
```

### Envio
```javascript
{
  donacionId: number,
  necesidadId: number,
  centroAcopioId: number,
  destino: string,
  transporte: string,
  estado: 'PLANIFICADO' | 'EN_TRANSITO' | 'ENTREGADO' | 'CANCELADO',
  observaciones?: string
}
```

## 🔗 Endpoints Disponibles

| Servicio | Método | Endpoint |
|----------|--------|----------|
| Donaciones | GET | `/api/v1/donaciones` |
| Donaciones | POST | `/api/v1/donaciones` |
| Donaciones | GET | `/api/v1/donaciones/{id}` |
| Donaciones | PUT | `/api/v1/donaciones/{id}` |
| Donaciones | DELETE | `/api/v1/donaciones/{id}` |
| Donaciones | PATCH | `/api/v1/donaciones/{id}/estado/{estado}` |
| Necesidades | GET | `/api/v1/necesidades` |
| Necesidades | POST | `/api/v1/necesidades` |
| Logística | GET | `/api/v1/logistica/envios` |
| Logística | POST | `/api/v1/logistica/envios` |
| Logística | GET | `/api/v1/logistica/centros-acopio` |
| Logística | POST | `/api/v1/logistica/centros-acopio` |

---

**Última actualización**: Enero 2025
**Versión**: 1.0 - Estructura con Axios
