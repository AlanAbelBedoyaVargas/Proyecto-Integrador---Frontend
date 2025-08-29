<template>
  <v-card elevation="2">
    <v-card-title class="d-flex align-center">
      <v-icon start icon="mdi-professional-hexagon"></v-icon>
      Perfil Profesional
    </v-card-title>
    <v-divider></v-divider>
    <div v-if="perfil">
      <v-list density="compact">
        <v-list-item
          prepend-icon="mdi-license"
          title="Número de Licencia"
          :subtitle="perfil.numero_licencia"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-star-outline"
          title="Especialización"
          :subtitle="perfil.especializacion || 'No especificada'"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-calendar-clock-outline"
          title="Años de Experiencia"
          :subtitle="`${perfil.anios_experiencia} años`"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-phone-outline"
          title="Número de Contacto"
          :subtitle="perfil.numero_contacto || 'No especificado'"
        ></v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-text>
        <p class="text-subtitle-1 font-weight-medium mb-2">Biografía</p>
        <p class="text-body-2 text-medium-emphasis">
          {{ perfil.biografia || 'No se ha proporcionado una biografía.' }}
        </p>
      </v-card-text>
    </div>
    <v-card-text v-else>Cargando información profesional...</v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  perfil: {
    type: Object,
    required: true,
  },
});
</script>