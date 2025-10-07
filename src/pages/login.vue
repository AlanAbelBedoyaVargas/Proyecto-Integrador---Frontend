<script setup>
import { login } from '@/services/authService'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import { ref } from 'vue'


const email = ref('')
const password = ref('')
const router = useRouter() // Para redirigir después del login
const authStore = useAuthStore()

async function handleLogin() {
  try {
    const credentials = {
      email: email.value,
      password: password.value
    }
    //Llama a la función del servicio que acabamos de crear
    const response = await login(credentials)

     // 3. ¡AQUÍ ESTÁ LA CONEXIÓN!
    // Llama a la función 'login' de nuestro cerebro y le pasa el token.
    authStore.login(response.token)

     alert('¡Login exitoso! Redirigiendo a la página principal...');
    //¡Prueba! Por ahora, solo veremos el resultado en la consola.
    //console.log('Login exitoso:', response)
    
    // Si el login es exitoso, te debe mostrar un objeto con 'usuario' y 'token'
    // ¡Este token es la llave para todo lo demás!
    router.push('/')
    // alert('¡Login exitoso! Revisa la consola (F12).');
    
    // Más adelante, aquí redirigiremos al usuario
    // router.push('/')

  } catch (error) {
    console.error('Error en el login:', error.response?.data || error.message)
    alert('Error en el login: ' + (error.response?.data?.error || 'Credenciales inválidas'));
  }
}
</script>

<route lang="yaml">
meta:
  layout: empty
</route>

<template>
  <v-container class="fill-height" fluid>
    <v-row  justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="6">
          <v-card-title class="text-h5 text-center">Iniciar sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                label="Correo electrónico"
                v-model="email"
                type="email"
                required
                prepend-inner-icon="mdi-email"
              />

              <v-text-field
                label="Contraseña"
                v-model="password"
                type="password"
                required
                prepend-inner-icon="mdi-lock"
              />

              <v-btn color="teal-lighten-1" class="mt-4" block type="submit">
                Iniciar sesión
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

