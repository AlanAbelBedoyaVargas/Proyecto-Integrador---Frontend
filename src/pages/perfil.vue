<!-- src/views/Perfil.vue (o donde lo tengas) -->
<template>
  <v-container>
    <div v-if="authStore.usuario">
      <!-- 1. ENCABEZADO DEL PERFIL (Reutilizable y visualmente atractivo) -->
      <EncabezadoPerfil :usuario="authStore.usuario" />

      <!-- 2. LAYOUT DE DOS COLUMNAS -->
      <v-row>
        <!-- Columna Izquierda: Info general y acciones -->
        <v-col cols="12" md="5">
          <!-- Tu componente de info general encaja perfecto aquí -->
          <InformacionGeneral :usuario="authStore.usuario" class="mb-6" />
          
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

        <!-- Columna Derecha: Panel específico del rol -->
        <v-col cols="12" md="7">
          <!-- Aquí mostramos el componente correspondiente al rol -->
          <div v-if="perfilDetallado">
            <PerfilProfesional
              v-if="authStore.userRole === 'nutricionista'"
              :perfil="perfilDetallado"
            />
            <PerfilSalud
              v-else-if="authStore.userRole === 'paciente'"
              :perfil="perfilDetallado"
            />
          </div>
          <!-- Muestra un loader mientras se cargan los datos detallados -->
          <div v-else>
              <v-progress-linear indeterminate color="primary"></v-progress-linear>
              <p class="text-center mt-2">Cargando detalles del perfil...</p>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Mensaje si el usuario no está cargado aún -->
    <div v-else class="text-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
      <p class="mt-4">Cargando perfil...</p>
    </div>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref, onMounted } from 'vue';



// Importa tu servicio API (debes crearlo si no lo tienes)
// import { getPerfilDetallado } from '@/services/apiService';

const authStore = useAuthStore();
const perfilDetallado = ref(null);

// Cuando el componente se monta, busca los datos detallados.
onMounted(async () => {
  // Solo ejecuta si tenemos un rol definido
  if (authStore.userRole) {
    try {
      // **AQUÍ VA TU LLAMADA REAL A LA API**
      // El backend debe usar el token para identificar al usuario y devolver
      // los datos de la tabla 'nutricionistas' o 'pacientes' según corresponda.
      // const response = await getPerfilDetallado();
      // perfilDetallado.value = response.data;
      
      // --- INICIO: SIMULACIÓN DE API (ELIMINAR EN PRODUCCIÓN) ---
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula latencia de red
      if (authStore.userRole === 'nutricionista') {
        perfilDetallado.value = {
          numero_licencia: 'LIC-12345678',
          especializacion: 'Nutrición Deportiva',
          anios_experiencia: 8,
          biografia: 'Apasionado por ayudar a las personas a alcanzar sus metas a través de la comida.',
          numero_contacto: '+1 234 567 890',
        };
      } else {
        perfilDetallado.value = {
          fechaNacimiento: '1990-05-15',
          sexo: 'femenino',
          peso_kg: '75.50',
          altura_cm: '160.00',
          objetivo: 'Perder grasa y ganar músculo',
          condicion_medica: 'Ninguna',
          nivel_actividad: { nombre: 'Activo' }
        };
      }
      // --- FIN: SIMULACIÓN DE API ---

    } catch (error) {
      console.error("Error al cargar los detalles del perfil:", error);
      // Aquí podrías mostrar una notificación de error al usuario
    }
  }
});
</script>

<style scoped>
.d-grid {
  display: grid;
}
</style>