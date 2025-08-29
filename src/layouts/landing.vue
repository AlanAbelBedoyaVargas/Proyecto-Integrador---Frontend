<!-- src/layouts/landing.vue -->
<template>
   <v-app-bar app>
    <v-toolbar-title>Mi Aplicación</v-toolbar-title>
    <!-- <v-spacer /> -->
    <v-btn to="/" variant="text">Inicio</v-btn>
    <v-btn to="/about" variant="text">Acerca de</v-btn>
    <v-btn to="/login" variant="text">Log In</v-btn>
  </v-app-bar>
   <v-main >
      <router-view />
    </v-main>
</template>