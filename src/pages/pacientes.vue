<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="text-h6 d-flex justify-space-between">
        Lista de Pacientes
        <!-- Botón para abrir el diálogo -->
        <v-btn color="primary" @click="dialog = true">Nuevo Paciente</v-btn>
      </v-card-title>

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

    <!-- Formulario en diálogo -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6">Registrar Nuevo Paciente</v-card-title>
        <v-card-text>
          <v-text-field v-model="nuevoPaciente.nombre" label="Nombre" />
          <v-text-field v-model="nuevoPaciente.apellido" label="Apellido" />
          <v-text-field v-model="nuevoPaciente.email" label="Email" />
          <v-text-field v-model="nuevoPaciente.username" label="Username" />
          <v-text-field v-model="nuevoPaciente.password" label="Password" type="password" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="guardarPaciente">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllUsers } from '@/services/userService'

const usuarios = ref([])
const dialog = ref(false)

const nuevoPaciente = ref({
  nombre: '',
  apellido: '',
  email: '',
  username: '',
  password: ''
})

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

const guardarPaciente = () => {
  console.log('Paciente a guardar:', nuevoPaciente.value)
  dialog.value = false
}
</script>
