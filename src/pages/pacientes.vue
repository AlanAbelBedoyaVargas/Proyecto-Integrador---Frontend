<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h6">Lista de Pacientes</v-card-title>

      <v-data-table
        :headers="headers"
        :items="usuarios"
        :items-per-page="5"
        class="elevation-1"
      >
        <template #item.rol="{ item }">
          <v-chip :color="item.rol === 'nutricionista' ? 'green' : 'blue'" dark>
            {{ item.rol }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllUsers } from '@/services/userService'

const usuarios = ref([])

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Nombre', value: 'nombre' },
  { title: 'Apellido', value: 'apellido' },
  { title: 'Email', value: 'email' },
  { title: 'Username', value: 'username' },
  { title: 'Rol', value: 'rol' },
]

onMounted(async () => {
  try {
    usuarios.value = await getAllUsers()
  } catch (error) {
    console.error('Error al obtener los pacientes:', error)
  }
})
</script>

<route lang="yaml">
meta:
  layout: default
</route>
