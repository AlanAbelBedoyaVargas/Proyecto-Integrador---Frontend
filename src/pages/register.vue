<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-4" elevation="6">
          <v-card-title class="text-h5 text-center">Registrarse</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                label="Nombre"
                v-model="nombre"
                required
                prepend-inner-icon="mdi-account"
              />

              <v-text-field
                label="Apellido"
                v-model="apellido"
                required
                prepend-inner-icon="mdi-account"
              />

              <v-text-field
                label="Correo electrónico"
                v-model="email"
                type="email"
                required
                prepend-inner-icon="mdi-email"
              />

              <v-text-field
                label="Nombre de usuario"
                v-model="username"
                prepend-inner-icon="mdi-account-circle"
              />

              <v-text-field
                label="Contraseña"
                v-model="password"
                type="password"
                required
                prepend-inner-icon="mdi-lock"
              />

              <v-select
                label="Rol"
                v-model="rol"
                :items="roles"
                required
                prepend-inner-icon="mdi-account-switch"
              />

              <v-btn color="teal-lighten-1" class="mt-4" block type="submit">
                Registrarse
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { register } from '@/services/authService'

const nombre = ref('')
const apellido = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const rol = ref(null)

const roles = ['paciente', 'nutricionista']

async function handleRegister() {
  try {
    const userData = {
      nombre: nombre.value,
      apellido: apellido.value,
      email: email.value,
      username: username.value || null,
      password: password.value,
      rol: rol.value
    }

    const response = await register(userData)
    console.log('Registro exitoso:', response)

    // Aquí podrías redirigir a login o dashboard
  } catch (error) {
    console.error('Error al registrar:', error.response?.data || error.message)
  }
}
</script>

<route lang="yaml">
meta:
  layout: empty
</route>
