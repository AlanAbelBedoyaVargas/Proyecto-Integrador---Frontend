import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3008/api/auth', // Cambia esto por la URL real de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
})


export async function register(userData) {
  const response = await API.post('/register', userData)
  return response.data
}
export async function login(credentials) {
  const response = await API.post('/login', credentials)
  return response.data
}