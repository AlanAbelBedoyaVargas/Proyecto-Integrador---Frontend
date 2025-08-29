import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode' // Necesitaremos esta librería, la instalaremos ahora
import router from '@/router' // Importa la configuración del router

// 'useAuthStore' es como llamamos a nuestro "cerebro" de autenticación.
// Lo usaremos en otros componentes para acceder a esta información.
export const useAuthStore = defineStore('auth', () => {
  // 'token' es una variable reactiva. Si cambia, Vue lo sabrá.
  // La iniciamos con el valor que pueda existir en el localStorage del navegador.
  const token = ref(localStorage.getItem('token'))
  
  // 'usuario' guardará la información decodificada del token (id, username, rol).
  const usuario = ref(null)

  // Esta función decodifica el token para obtener los datos del usuario.
  function decodificarToken() {
    if (token.value) {
      try {
        const decoded = jwtDecode(token.value)
        // Guardamos los datos del usuario (importante: 'rol' debe coincidir con tu backend)
        usuario.value = { id: decoded.id, username: decoded.username, rol: decoded.rol }
      } catch (e) {
        console.error('Token inválido, limpiando...', e)
        logout() // Si el token es malo, cerramos sesión.
      }
    }
  }

  // Llamamos a la función una vez al cargar la página por si ya había una sesión activa.
  decodificarToken()
  
  // Función que se llamará desde el componente de Login.
  function login(accessToken) {
    console.log("Guardando token en Pinia y localStorage...");
    localStorage.setItem('token', accessToken) // Guardamos el token en la "cartera" del navegador.
    token.value = accessToken // Actualizamos nuestra variable reactiva.
    decodificarToken() // Leemos el nuevo token.
  }

  // Función para cerrar sesión.
  function logout() {
    localStorage.removeItem('token') // Borramos el token de la cartera.
    token.value = null
    usuario.value = null
    router.push('/login') // Redirigimos al usuario a la página de login.
  }

  // Una 'propiedad computada'. Es como una variable que se calcula automáticamente.
  // Nos dice de forma sencilla si el usuario está autenticado o no.
  const isAuthenticated = computed(() => !!usuario.value)
  
  // ¡LA PROPIEDAD CLAVE! Nos da el rol del usuario actual.
  const userRole = computed(() => usuario.value?.rol)

  // Exponemos las variables y funciones para que otros componentes puedan usarlas.
  return { usuario, login, logout, isAuthenticated, userRole }
})