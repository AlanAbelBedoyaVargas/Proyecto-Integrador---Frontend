<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-heart-pulse"></v-icon>
      Perfil de Salud
    </v-card-title>
    <v-divider></v-divider>
    <div v-if="perfil">
      <!-- Métricas principales -->
      <v-row no-gutters class="text-center pa-4">
        <v-col>
          <div class="text-h6">{{ perfil.peso_kg }}</div>
          <div class="text-caption text-medium-emphasis">Peso (kg)</div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <div class="text-h6">{{ perfil.altura_cm }}</div>
          <div class="text-caption text-medium-emphasis">Altura (cm)</div>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col>
          <div class="text-h6">{{ age }}</div>
          <div class="text-caption text-medium-emphasis">Edad</div>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <!-- Detalles adicionales -->
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-bullseye-arrow"
          title="Objetivo Principal"
          :subtitle="perfil.objetivo"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-gender-male-female"
          title="Sexo"
          :subtitle="perfil.sexo"
          class="text-capitalize"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-medical-bag"
          title="Condiciones Médicas"
          :subtitle="perfil.condicion_medica || 'Ninguna reportada'"
        ></v-list-item>
        <!-- Asumo que el nivel de actividad viene como un objeto anidado desde el backend -->
        <v-list-item
            v-if="perfil.nivel_actividad"
            prepend-icon="mdi-run-fast"
            title="Nivel de Actividad"
            :subtitle="perfil.nivel_actividad.nombre"
          >
        </v-list-item>
      </v-list>
    </div>
     <v-card-text v-else>Cargando información de salud...</v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  perfil: {
    type: Object,
    required: true,
  },
});

const age = computed(() => {
  if (!props.perfil?.fechaNacimiento) return 'N/A';
  const birthDate = new Date(props.perfil.fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});
</script>