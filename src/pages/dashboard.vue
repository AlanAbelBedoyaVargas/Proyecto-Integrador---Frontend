<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Bienvenido, Nutricionista</h1>
      </v-col>

      <v-col cols="12" md="6" lg="3" v-for="card in dashboardCards" :key="card.title">
        <v-card>
          <v-card-title>{{ card.title }}</v-card-title>
          <v-card-subtitle>{{ card.subtitle }}</v-card-subtitle>
          <v-card-text>{{ card.text }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
layout: empty
</route>

<script setup>
const dashboardCards = [
  { title: 'Pacientes', subtitle: 'Registrados', text: '12' },
  { title: 'Planes Activos', subtitle: 'Nutricionales', text: '5' },
  { title: 'Evaluaciones Recientes', subtitle: 'Esta semana', text: '3' },
  { title: 'Alertas', subtitle: 'Planes a revisar', text: '2' }
]
</script>
