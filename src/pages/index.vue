<template>
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
  
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';

const authStore = useAuthStore();
</script>
