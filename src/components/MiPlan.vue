<template>
  <v-container>
    <!-- 1. ESTADO DE CARGA INICIAL (para la lista de planes) -->
    <div v-if="loadingList" class="text-center pa-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <p class="mt-4 text-medium-emphasis">Buscando tus planes...</p>
    </div>

    <!-- 2. ESTADO SIN PLANES ASIGNADOS -->
    <div v-else-if="!loadingList && plansList.length === 0" class="text-center pa-10">
      <v-icon size="80" color="grey-lighten-1">mdi-file-document-outline</v-icon>
      <h2 class="text-h5 mt-4">Aún no tienes planes de alimentación</h2>
      <p class="text-medium-emphasis mt-2">Ponte en contacto con tu nutricionista para que te asigne uno.</p>
    </div>

    <!-- 3. VISTA PRINCIPAL (CUANDO HAY PLANES) -->
    <div v-else>
      <!-- Selector de Planes -->
      <v-select
        v-model="selectedPlanId"
        :items="plansList"
        item-title="titulo"
        item-value="id"
        label="Seleccionar Plan de Alimentación"
        variant="outlined"
        class="mb-6"
        :loading="loadingDetails"
      >
        <!-- Template personalizado para cada item en el desplegable -->
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :subtitle="`${formatearFecha(item.raw.fecha_inicio)} - ${formatearFecha(item.raw.fecha_fin)}`">
            <template v-slot:append>
              <v-chip
                :color="item.raw.activo ? 'success' : 'grey'"
                size="small"
                variant="tonal"
              >
                {{ item.raw.activo ? 'Activo' : 'Archivado' }}
              </v-chip>
            </template>
          </v-list-item>
        </template>
      </v-select>

      <!-- Loader mientras se cargan los detalles de un plan seleccionado -->
      <div v-if="loadingDetails" class="text-center">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
        <p class="mt-4 text-caption">Cargando detalles del plan...</p>
      </div>

      <!-- Contenido del plan seleccionado -->
      <div v-if="currentPlanData && !loadingDetails">
        <!-- Tarjeta de Resumen del Plan -->
        <v-card class="mb-8" :variant="currentPlanData.activo ? 'elevated' : 'outlined'" elevation="4" :color="currentPlanData.activo ? 'grey-darken-3' : 'transparent'">
          <v-card-title class="text-h5 text-wrap d-flex justify-space-between align-center">
            {{ currentPlanData.titulo }}
             <v-chip :color="currentPlanData.activo ? 'success' : 'grey'">
              {{ currentPlanData.activo ? 'Plan Actual' : 'Plan Archivado' }}
            </v-chip>
          </v-card-title>
          <v-card-subtitle>{{ currentPlanData.descripcion }}</v-card-subtitle>
           <v-divider class="my-2"></v-divider>
          <!-- (El resto de la tarjeta de resumen es igual que antes) -->
          <v-card-text>
             <v-row align="center">
                <v-col cols="12" sm="6" class="d-flex align-center ga-3">
                  <v-icon color="primary" size="large">mdi-calendar-range</v-icon>
                  <div>
                    <div class="font-weight-bold">Periodo del Plan</div>
                    <div>{{ formatearFecha(currentPlanData.fecha_inicio) }} - {{ formatearFecha(currentPlanData.fecha_fin) }}</div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" class="d-flex align-center ga-3">
                  <v-icon color="primary" size="large">mdi-fire</v-icon>
                  <div>
                    <div class="font-weight-bold">Objetivo Calórico</div>
                    <div>{{ currentPlanData.calorias_diarias }} kcal / día</div>
                  </div>
                </v-col>
              </v-row>
          </v-card-text>
        </v-card>

        <!-- Navegación por Días y Comidas (Exactamente igual que antes) -->
        <v-tabs v-model="tab" color="primary" align-tabs="center" grow>
          <v-tab v-for="(dia, index) in diasSemana" :key="index" :value="index">{{ dia }}</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4 pa-1">
           <v-window-item v-for="(dia, diaIndex) in diasSemana" :key="diaIndex" :value="diaIndex">
              <div v-if="getComidasParaDia(diaIndex).length > 0">
                 <!-- ... (El v-row y v-col con las tarjetas de comida no cambia) ... -->
                 <v-row>
                    <v-col v-for="comida in getComidasParaDia(diaIndex)" :key="comida.tipo_comida" cols="12" md="6">
                        <v-card variant="outlined">
                        <v-card-title class="text-capitalize d-flex justify-space-between">
                            {{ comida.tipo_comida }}
                            <v-chip color="primary" size="small">{{ getCaloriasComida(comida).toFixed(0) }} kcal</v-chip>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-list lines="two" density="compact">
                            <v-list-item v-for="item in comida.alimentos" :key="item.id_alimento" :title="item.alimento.nombre" :subtitle="item.alimento.categoria">
                                <template v-slot:append>
                                    <div class="text-right">
                                    <div class="font-weight-bold">{{ item.cantidad_g }} g</div>
                                    <div class="text-caption text-medium-emphasis">{{ item.calorias_calculadas }} kcal</div>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>
                        </v-card>
                    </v-col>
                </v-row>
              </div>
              <v-alert v-else type="info" variant="tonal" class="mt-4" icon="mdi-food-off-outline">
                No hay comidas asignadas para este día en este plan.
              </v-alert>
           </v-window-item>
        </v-window>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// --- ESTADO ---
const loadingList = ref(true);      // Para la carga inicial de la lista de planes
const loadingDetails = ref(false);    // Para la carga de los detalles de un plan específico
const plansList = ref([]);          // Lista de todos los planes del paciente (ligeros)
const selectedPlanId = ref(null);   // ID del plan seleccionado en el VSelect
const currentPlanData = ref(null);  // Objeto completo del plan que se está mostrando
const tab = ref(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1); // Día actual

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const ordenComidas = { 'desayuno': 1, 'almuerzo': 2, 'cena': 3, 'snack': 4 };

// --- CICLO DE VIDA Y WATCHERS ---
onMounted(() => {
  fetchPlansList();
});

// Este watcher reacciona cuando el usuario elige un plan diferente en el VSelect
watch(selectedPlanId, (newId) => {
  if (newId) {
    fetchPlanDetails(newId);
  }
});

// --- API (SIMULADAS) ---
// 1. Obtiene la lista de todos los planes (versión ligera)
async function fetchPlansList() {
  loadingList.value = true;
  // Llamada real: const response = await api.get('/mis-planes');
  // Debería devolver un array de objetos de plan, sin las comidas detalladas
  await new Promise(resolve => setTimeout(resolve, 1000));
  plansList.value = mockPlansList;

  // Busca el plan activo para seleccionarlo por defecto
  const activePlan = plansList.value.find(p => p.activo);
  if (activePlan) {
    selectedPlanId.value = activePlan.id;
  } else if (plansList.value.length > 0) {
    // Si no hay ninguno activo, selecciona el más reciente
    selectedPlanId.value = plansList.value[0].id;
  }
  loadingList.value = false;
}

// 2. Obtiene los detalles completos de UN plan específico por su ID
async function fetchPlanDetails(planId) {
  loadingDetails.value = true;
  currentPlanData.value = null; // Limpia la vista anterior
  // Llamada real: const response = await api.get(`/planes/${planId}`);
  // Debería devolver el objeto de plan completo con comidas y alimentos
  await new Promise(resolve => setTimeout(resolve, 800));
  // Simulación: encontramos el plan completo en nuestra data de muestra
  currentPlanData.value = mockFullPlansData.find(p => p.id === planId);
  loadingDetails.value = false;
}

// --- FUNCIONES HELPERS (sin cambios) ---
const getComidasParaDia = (diaIndex) => {
  if (!currentPlanData.value) return [];
  return currentPlanData.value.comidas.filter(c => c.dia_semana === diaIndex + 1).sort((a, b) => ordenComidas[a.tipo_comida] - ordenComidas[b.tipo_comida]);
};
const getCaloriasComida = (comida) => comida.alimentos.reduce((total, item) => total + parseFloat(item.calorias_calculadas), 0);
const formatearFecha = (fechaString) => new Date(fechaString + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' });

// --- DATOS DE MUESTRA (ACTUALIZADOS) ---
// Simula la respuesta de GET /mis-planes (lista ligera)
const mockPlansList = [
  { id: 101, titulo: "Plan de Definición - Fase 2", fecha_inicio: "2024-06-01", fecha_fin: "2024-06-30", activo: true },
  { id: 100, titulo: "Plan de Volumen Inicial", fecha_inicio: "2024-05-01", fecha_fin: "2024-05-31", activo: false },
  { id: 99, titulo: "Plan de Adaptación", fecha_inicio: "2024-04-15", fecha_fin: "2024-04-30", activo: false },
];

// Simula la respuesta de GET /planes/:id (datos completos para cada plan)
const mockFullPlansData = [
    { id: 101, titulo: "Plan de Definición - Fase 2", activo: true, /* ...resto de datos completos con comidas... */ fecha_inicio: "2024-06-01", fecha_fin: "2024-06-30", calorias_diarias: 2100, descripcion: "Ajuste de macros para continuar la pérdida de grasa.", comidas: [ /* ... comidas para el plan 101 ... */ ] },
    { id: 100, titulo: "Plan de Volumen Inicial", activo: false, /* ...resto de datos completos con comidas... */ fecha_inicio: "2024-05-01", fecha_fin: "2024-05-31", calorias_diarias: 2800, descripcion: "Superávit calórico controlado para ganancia muscular.", comidas: [ /* ... comidas para el plan 100 ... */ { dia_semana: 1, tipo_comida: 'almuerzo', alimentos: [{ id_alimento: 15, cantidad_g: "250.00", calorias_calculadas: "412.00", alimento: { nombre: "Pechuga de Pollo", categoria: "Carnes" }}]}] },
    { id: 99, titulo: "Plan de Adaptación", activo: false, /* ...resto de datos completos con comidas... */ fecha_inicio: "2024-04-15", fecha_fin: "2024-04-30", calorias_diarias: 2500, descripcion: "Plan inicial para acostumbrar el cuerpo.", comidas: [ /* ... comidas para el plan 99 ... */ ] }
];

</script>