<template>
  <!-- Barra lateral -->
    <v-navigation-drawer v-model="drawer" expand-on-hover rail app permanent :width="250">
       <!-- LOGO -->
    <v-list-item class="px-2">
      <template #prepend>
        <v-img
          src="@/assets/logoN.png"
          width="40"
          height="40"
          class="mr-2"
        />
      </template>
      <v-list-item-title>NUTRITECH</v-list-item-title>
    </v-list-item>

    <v-divider class="my-2" />

      <!-- Menú de navegación -->
      <v-list density="compact" nav>
        
        <!-- ¡AQUÍ ESTÁ EL CAMBIO! Usamos v-for para iterar sobre la lista filtrada -->
        <v-list-item
          v-for="item in visibleMenuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :to="item.to"
          :title="item.title"
          link
        />
         <!--  ====> AÑADIMOS ESTA SECCIÓN <==== -->
      <!-- Mostramos el divisor y el botón de logout SOLO si el usuario está autenticado -->
      <template v-if="authStore.isAuthenticated">
        <v-divider class="my-3"></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Cerrar Sesión"
          @click="handleLogout"
        />
      </template>
        
      </v-list> 
    </v-navigation-drawer>

  <v-main>
     <!-- Barra superior -->
    <v-app-bar app color="teal-lighten-1">
      <!-- Botón para abrir/cerrar el drawer -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-app-bar-title>Dashboard</v-app-bar-title>
    </v-app-bar>
    <!-- Contenido principal -->
    <v-container>
      <router-view />
    </v-container>
  </v-main>
  
  
  <AppFooter/>
  
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'


const drawer = ref(true)
function toggleDrawer() {
  drawer.value = !drawer.value
}
// 2. Crea una instancia para usarla
const authStore = useAuthStore()

// 3. Define TODAS las opciones posibles del menú.
//    Añadimos una propiedad 'meta' para indicar qué roles pueden ver cada opción.
const allMenuItems = [
  { title: 'Inicio', icon: 'mdi-home', to: '/', meta: { roles: ['paciente', 'nutricionista'] } },
  { title: 'Pacientes', icon: 'mdi-account-group', to: '/pacientes', meta: { roles: ['nutricionista'] } },
  { title: 'Acompañamiento', icon: 'mdi-chart-box', to: '/acompanamiento', meta: { roles: ['paciente'] } },
  { title: 'Planes de Alimentación', icon: 'mdi-nutrition', to: '/crearplan', meta: { roles: ['paciente', 'nutricionista'] } },
  { title: 'Alimentos', icon: 'mdi-food-apple', to: '/food', meta: { roles: ['nutricionista'] } },
  { title: 'Perfil', icon: 'mdi-account', to: '/perfil', meta: { roles: ['paciente', 'nutricionista'] } },
]

// 4. ¡LA MAGIA FINAL! Creamos una lista computada.
//    Esta lista se recalculará automáticamente cada vez que el rol del usuario cambie.
const visibleMenuItems = computed(() => {
  // Le preguntamos al "cerebro" cuál es el rol del usuario actual.
  const role = authStore.userRole

  if (!role) {
    // Si no hay usuario logueado, no mostramos nada (o podrías mostrar un item de "Login")
    return []
  }

  // Filtramos la lista completa, devolviendo solo los items que incluyen el rol del usuario.
  return allMenuItems.filter(item => item.meta.roles.includes(role))
})

// 3. ====> AÑADE ESTA FUNCIÓN <====
function handleLogout() {
  console.log('Cerrando sesión...')
  
  // Llama a la función 'logout' que está en nuestro cerebro Pinia.
  // Esto borrará el token de localStorage y reseteará el estado en Pinia.
  authStore.logout()
  
  // Redirige al usuario a la página de login.
  //router.push('/login')
}
</script>