import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3008/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function getAllUsers() {
  const response = await API.get('/usuarios')
  return response.data
}
