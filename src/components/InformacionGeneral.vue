<!-- src/components/perfil/InformacionGeneral.vue -->
<template>
  <v-card v-if="usuario" outlined>
    <v-card-title>Información de la Cuenta</v-card-title>
    <v-card-text>
      <v-list dense>
        <v-list-item>
          <v-list-item-title><strong>Nombre Completo:</strong></v-list-item-title>
          <v-list-item-subtitle>{{ usuario.nombre }} {{ usuario.apellido }}</v-list-item-subtitle>
        </v-list-item>
        
        <v-list-item>
          <v-list-item-title><strong>Nombre de Usuario:</strong></v-list-item-title>
          <v-list-item-subtitle>{{ usuario.username }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title><strong>Email:</strong></v-list-item-title>
          <v-list-item-subtitle>{{ usuario.email }}</v-list-item-subtitle>
        </v-list-item>

        <v-list-item>
          <v-list-item-title><strong>Rol:</strong></v-list-item-title>
          <!-- Podemos hacer que el rol se vea más bonito -->
          <v-chip :color="rolColor" small>{{ usuario.rol }}</v-chip>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps, computed } from 'vue';

// 1. Definimos las 'props'. Este componente ESPERA recibir un objeto 'usuario'.
const props = defineProps({
  usuario: {
    type: Object,
    required: true
  }
});

// 2. Lógica para que el chip de rol cambie de color (un pequeño extra)
const rolColor = computed(() => {
  if (props.usuario.rol === 'nutricionista') {
    return 'teal';
  }
  if (props.usuario.rol === 'paciente') {
    return 'blue';
  }
  return 'grey'; // Color por defecto
});
</script>