import axios from 'axios'

// Crea una instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // ← Cambia esto a la URL de tu backend
  timeout: 10000,  // Tiempo máximo de espera (10 segundos)
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api