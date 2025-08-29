<template>
  <v-container>
    <!-- Contenedor para simular el cambio de usuario -->
    <div class="d-flex justify-end mb-4">
       <v-btn-toggle v-model="selectedUser" mandatory variant="outlined" density="compact">
        <v-btn>Nutricionista</v-btn>
        <v-btn>Paciente</v-btn>
      </v-btn-toggle>
    </div>

    <!-- INICIO DEL DISEÑO DEL PERFIL -->
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">

        <!-- 1. ENCABEZADO DEL PERFIL -->
        <v-card variant="text" class="mb-8">
          <v-card-text>
            <div class="d-flex flex-column flex-sm-row align-center">
              <v-avatar color="grey-darken-1" size="96">
                <!-- Puedes reemplazar esto con una v-img si tienes URL de avatares -->
                <span class="text-h4">{{ avatarInitial }}</span>
              </v-avatar>
              <div class="text-center text-sm-left ml-sm-6 mt-4 mt-sm-0">
                <h2 class="text-h4 font-weight-bold">{{ fullName }}</h2>
                <v-chip
                  :color="currentUser.rol === 'nutricionista' ? 'cyan-lighten-1' : 'green-lighten-1'"
                  class="mt-2 text-uppercase font-weight-bold"
                  label
                  size="small"
                >
                  {{ currentUser.rol }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 2. TARJETAS DE INFORMACIÓN -->
        <v-row>
          <!-- Columna Izquierda: Información de Cuenta y Acciones -->
          <v-col cols="12" md="5">
            <v-card class="mb-6" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon start icon="mdi-account-circle-outline"></v-icon>
                Información de la Cuenta
              </v-card-title>
              <v-divider></v-divider>
              <v-list density="compact" lines="two">
                <v-list-item
                  prepend-icon="mdi-email-outline"
                  title="Email"
                  :subtitle="currentUser.email"
                ></v-list-item>
                <v-divider inset></v-divider>
                <v-list-item
                  prepend-icon="mdi-account-outline"
                  title="Nombre de Usuario"
                  :subtitle="currentUser.username"
                ></v-list-item>
              </v-list>
            </v-card>

            <v-card elevation="2">
               <v-card-title class="d-flex align-center">
                <v-icon start icon="mdi-cog-outline"></v-icon>
                Acciones
              </v-card-title>
               <v-divider></v-divider>
               <v-card-text class="d-grid ga-2">
                 <v-btn color="primary" block prepend-icon="mdi-pencil-outline">Editar Perfil</v-btn>
                 <v-btn variant="outlined" block>Cambiar Contraseña</v-btn>
               </v-card-text>
            </v-card>
          </v-col>

          <!-- Columna Derecha: Información Específica del Rol -->
          <v-col cols="12" md="7">
            
            <!-- TARJETA PARA NUTRICIONISTA -->
            <v-card v-if="currentUser.rol === 'nutricionista'" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon start icon="mdi-professional-hexagon"></v-icon>
                Perfil Profesional
              </v-card-title>
              <v-divider></v-divider>
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-license"
                  title="Número de Licencia"
                  :subtitle="currentUser.numero_licencia"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-star-outline"
                  title="Especialización"
                  :subtitle="currentUser.especializacion || 'No especificada'"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-calendar-clock-outline"
                  title="Años de Experiencia"
                  :subtitle="`${currentUser.anios_experiencia} años`"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-phone-outline"
                  title="Número de Contacto"
                  :subtitle="currentUser.numero_contacto || 'No especificado'"
                ></v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-card-text>
                <p class="text-subtitle-1 font-weight-medium mb-2">Biografía</p>
                <p class="text-body-2 text-medium-emphasis">
                  {{ currentUser.biografia || 'No se ha proporcionado una biografía.' }}
                </p>
              </v-card-text>
            </v-card>

            <!-- TARJETA PARA PACIENTE -->
            <v-card v-if="currentUser.rol === 'paciente'" elevation="2">
              <v-card-title class="d-flex align-center">
                <v-icon start icon="mdi-heart-pulse"></v-icon>
                Perfil de Salud
              </v-card-title>
              <v-divider></v-divider>
              <!-- Métricas principales -->
              <v-row no-gutters class="text-center pa-4">
                <v-col>
                  <div class="text-h6">{{ currentUser.peso_kg }}</div>
                  <div class="text-caption text-medium-emphasis">Peso (kg)</div>
                </v-col>
                <v-divider vertical></v-divider>
                 <v-col>
                  <div class="text-h6">{{ currentUser.altura_cm }}</div>
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
                  :subtitle="currentUser.objetivo"
                ></v-list-item>
                 <v-list-item
                  prepend-icon="mdi-gender-male-female"
                  title="Sexo"
                  :subtitle="currentUser.sexo"
                  class="text-capitalize"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-medical-bag"
                  title="Condiciones Médicas"
                  :subtitle="currentUser.condicion_medica || 'Ninguna reportada'"
                ></v-list-item>
                <v-list-item
                  prepend-icon="mdi-run-fast"
                  title="Nivel de Actividad"
                  :subtitle="currentUser.nivel_actividad.nombre"
                >
                  <template v-slot:append>
                    <v-tooltip location="top" :text="currentUser.nivel_actividad.descripcion">
                      <template v-slot:activator="{ props }">
                        <v-icon v-bind="props">mdi-information-outline</v-icon>
                      </template>
                    </v-tooltip>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>

          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// --- DATOS DE MUESTRA (SIMULACIÓN DE API) ---
// En una aplicación real, obtendrías estos datos de tu backend/store (Pinia, Vuex)
// y los pondrías en `currentUser`.
const nutricionistaData = {
  // Tabla 'usuarios'
  nombre: 'Abel',
  apellido: 'Rojas',
  email: 'abel10@nutritech.com',
  username: 'abel10',
  rol: 'nutricionista',
  // Tabla 'nutricionistas'
  numero_licencia: 'LIC-12345678',
  especializacion: 'Nutrición Deportiva y Clínica',
  anios_experiencia: 8,
  biografia: 'Nutricionista apasionado por la ciencia de la alimentación y su impacto en el rendimiento deportivo y la salud general. Mi objetivo es crear planes sostenibles y personalizados.',
  numero_contacto: '+52 1 55 1234 5678',
};

const pacienteData = {
  // Tabla 'usuarios'
  nombre: 'Albina',
  apellido: 'Vargas',
  email: 'albina@gmail.com',
  username: 'carloss',
  rol: 'paciente',
  // Tabla 'pacientes'
  fechaNacimiento: '1990-05-15',
  sexo: 'femenino',
  peso_kg: '75.50',
  altura_cm: '180.00',
  objetivo: 'Perder 10kg de grasa y ganar masa muscular.',
  condicion_medica: 'Diabetes tipo 2 controlada',
  // Objeto anidado simulando el JOIN con 'niveles_actividads'
  nivel_actividad: {
    id: 3,
    nombre: 'Activo',
    descripcion: 'Ejercicio/deporte intenso 3-5 días a la semana',
  },
};

// --- ESTADO DEL COMPONENTE ---
const selectedUser = ref(0); // 0 para Nutricionista, 1 para Paciente (para la demo)
const currentUser = ref(nutricionistaData);

// Observador para cambiar los datos de la demo
watch(selectedUser, (val) => {
  currentUser.value = val === 0 ? nutricionistaData : pacienteData;
});

// --- PROPIEDADES COMPUTADAS ---
const fullName = computed(() => {
  if (!currentUser.value) return '';
  return `${currentUser.value.nombre} ${currentUser.value.apellido}`;
});

const avatarInitial = computed(() => {
  if (!currentUser.value?.nombre) return '?';
  return currentUser.value.nombre.charAt(0).toUpperCase();
});

const age = computed(() => {
  if (currentUser.value.rol !== 'paciente' || !currentUser.value.fechaNacimiento) {
    return null;
  }
  const birthDate = new Date(currentUser.value.fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});
</script>

<style scoped>
.d-grid {
  display: grid;
}
</style>