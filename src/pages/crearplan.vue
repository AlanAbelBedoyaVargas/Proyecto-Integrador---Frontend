<template>
  <v-container>
    <v-card class="mx-auto" elevation="3">
      <v-card-title class="text-h5 pa-4 bg-teal-lighten-1">
        Crear Nuevo Plan de Alimentación
      </v-card-title>
      <v-card-text class="pa-5">
        
        <!-- SECCIÓN 1: DATOS GENERALES DEL PLAN -->
        <v-form ref="form" v-model="valid">
          <p class="text-h6 mb-4">1. Detalles del Plan</p>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="planData.titulo"
                label="Título del Plan"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-format-title"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="planData.id_paciente"
                :items="pacientes"
                item-title="nombreCompleto"
                item-value="id"
                label="Seleccionar Paciente"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-account-outline"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12">
               <v-textarea
                v-model="planData.descripcion"
                label="Descripción (Opcional)"
                variant="outlined"
                rows="2"
                prepend-inner-icon="mdi-text-long"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="planData.fecha_inicio"
                label="Fecha de Inicio"
                type="date"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar-start"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="planData.fecha_fin"
                label="Fecha de Fin"
                type="date"
                variant="outlined"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-calendar-end"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="planData.calorias_diarias"
                label="Calorías Diarias (kcal)"
                type="number"
                variant="outlined"
                :rules="[rules.required, rules.positive]"
                prepend-inner-icon="mdi-fire"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>

        <v-divider class="my-6"></v-divider>

        <!-- SECCIÓN 2: ESTRUCTURA DE COMIDAS POR DÍA -->
        <p class="text-h6 mb-4">2. Estructura Semanal de Comidas</p>
        <v-tabs v-model="tab" color="primary" align-tabs="center" grow>
          <v-tab v-for="(dia, index) in diasSemana" :key="index" :value="index">
            {{ dia }}
          </v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <v-window-item v-for="(dia, diaIndex) in diasSemana" :key="diaIndex" :value="diaIndex">
            <v-expansion-panels variant="inset" multiple>
              <v-expansion-panel
                v-for="(tipoComida, comidaIndex) in tiposComida"
                :key="comidaIndex"
              >
                <v-expansion-panel-title class="font-weight-bold text-capitalize">
                  {{ tipoComida }}
                  <v-spacer></v-spacer>
                  <v-chip
                    v-if="getAlimentosForMeal(diaIndex, tipoComida).length > 0"
                    color="primary"
                    size="small"
                    class="mr-2"
                  >
                    {{ getAlimentosForMeal(diaIndex, tipoComida).length }} alimentos
                  </v-chip>
                </v-expansion-panel-title>
                
                <v-expansion-panel-text>
                  <!-- Sub-sección para añadir alimentos -->
                  <div class="d-flex align-center ga-3 mb-4">
                    <v-autocomplete
                      :model-value="alimentoTemporal[diaIndex][tipoComida]?.id"
                      @update:model-value="val => updateTemporalAlimento(diaIndex, tipoComida, val)"
                      label="Buscar Alimento"
                      :items="alimentos"
                      item-title="nombre"
                      item-value="id"
                      variant="outlined"
                      density="compact"
                      hide-details
                      clearable
                    ></v-autocomplete>
                    <v-text-field
                      v-model.number="cantidadTemporal[diaIndex][tipoComida]"
                      label="Cantidad (g)"
                      type="number"
                      variant="outlined"
                      density="compact"
                      hide-details
                      style="max-width: 150px;"
                    ></v-text-field>
                    <v-btn 
                      color="primary" 
                      @click="addAlimento(diaIndex, tipoComida)"
                      :disabled="!alimentoTemporal[diaIndex][tipoComida]?.id || !cantidadTemporal[diaIndex][tipoComida]"
                    >
                      Añadir
                    </v-btn>
                  </div>
                  
                  <!-- Lista de alimentos añadidos -->
                  <v-list v-if="getAlimentosForMeal(diaIndex, tipoComida).length > 0" lines="one">
                    <v-list-item
                      v-for="(alimento, alimentoIndex) in getAlimentosForMeal(diaIndex, tipoComida)"
                      :key="alimentoIndex"
                      :title="findAlimentoById(alimento.id_alimento)?.nombre"
                      :subtitle="`${alimento.cantidad_g} gramos`"
                    >
                      <template v-slot:append>
                        <v-btn
                          color="red"
                          icon="mdi-delete-outline"
                          variant="text"
                          @click="removeAlimento(diaIndex, tipoComida, alimentoIndex)"
                        ></v-btn>
                      </template>
                    </v-list-item>
                  </v-list>
                   <v-alert v-else type="info" variant="tonal" density="compact" class="mt-4">
                    Aún no se han añadido alimentos para esta comida.
                  </v-alert>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-divider></v-divider>

      <!-- SECCIÓN 3: ACCIONES -->
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn 
          color="primary" 
          @click="handleSubmit" 
          :loading="loading" 
          :disabled="!valid"
          size="large"
          prepend-icon="mdi-content-save"
        >
          Guardar Plan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';

// --- ESTADO Y DATOS REACTIVOS ---

const form = ref(null); // Referencia al VForm
const valid = ref(false); // Estado de validación del formulario
const loading = ref(false); // Estado para el botón de envío
const tab = ref(0); // Pestaña del día activa

// Objeto principal que construiremos y enviaremos al backend
const planData = reactive({
  titulo: '',
  descripcion: '',
  id_paciente: null,
  fecha_inicio: '',
  fecha_fin: '',
  calorias_diarias: null,
  // El campo id_nutricionista se obtendría del usuario logueado,
  // no desde el formulario. Lo añadirías en el backend o antes de enviar.
  comidas: [], // Array de { dia_semana, tipo_comida, alimentos: [{ id_alimento, cantidad_g }] }
});

// Estado temporal para los campos de añadir alimento
const alimentoTemporal = ref({});
const cantidadTemporal = ref({});

// Datos de muestra (simulan llamadas a la API)
const pacientes = ref([]);
const alimentos = ref([]);
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const tiposComida = ['desayuno', 'almuerzo', 'cena', 'snack'];

// Reglas de validación de Vuetify
const rules = {
  required: value => !!value || 'Este campo es requerido.',
  positive: value => value > 0 || 'El valor debe ser positivo.',
};

// --- CICLO DE VIDA ---

onMounted(() => {
  // Simula la carga de datos del backend
  fetchMockData();
  // Inicializa las estructuras de datos temporales
  inicializarEstadoTemporal();
});

// --- MÉTODOS ---

function inicializarEstadoTemporal() {
  diasSemana.forEach((_, diaIndex) => {
    alimentoTemporal.value[diaIndex] = {};
    cantidadTemporal.value[diaIndex] = {};
    tiposComida.forEach(tipo => {
      alimentoTemporal.value[diaIndex][tipo] = { id: null };
      cantidadTemporal.value[diaIndex][tipo] = null;
    });
  });
}

// Función auxiliar para encontrar (o crear) una comida en el array `planData.comidas`
function findOrCreateMeal(diaIndex, tipoComida) {
  let meal = planData.comidas.find(
    c => c.dia_semana === diaIndex + 1 && c.tipo_comida === tipoComida
  );

  if (!meal) {
    meal = {
      dia_semana: diaIndex + 1, // Ajustamos a 1-7 si tu backend lo necesita así
      tipo_comida: tipoComida,
      alimentos: [],
    };
    planData.comidas.push(meal);
  }

  return meal;
}

// Función para añadir un alimento a la comida correspondiente
function addAlimento(diaIndex, tipoComida) {
  const alimentoId = alimentoTemporal.value[diaIndex][tipoComida]?.id;
  const cantidad = cantidadTemporal.value[diaIndex][tipoComida];

  if (!alimentoId || !cantidad || cantidad <= 0) {
    // Podrías mostrar una notificación de error aquí
    return;
  }
  
  const meal = findOrCreateMeal(diaIndex, tipoComida);
  
  // Evitar duplicados (opcional, podrías querer actualizar la cantidad en su lugar)
  const existingAlimento = meal.alimentos.find(a => a.id_alimento === alimentoId);
  if (existingAlimento) {
    existingAlimento.cantidad_g += cantidad;
  } else {
    meal.alimentos.push({
      id_alimento: alimentoId,
      cantidad_g: cantidad,
    });
  }

  // Limpiar campos temporales
  alimentoTemporal.value[diaIndex][tipoComida] = { id: null };
  cantidadTemporal.value[diaIndex][tipoComida] = null;
}

// Función para eliminar un alimento de una comida
function removeAlimento(diaIndex, tipoComida, alimentoIndex) {
  const meal = findOrCreateMeal(diaIndex, tipoComida);
  meal.alimentos.splice(alimentoIndex, 1);
  
  // Si la comida queda vacía, la eliminamos del array principal para mantener limpio el JSON final
  if(meal.alimentos.length === 0) {
    const mainIndex = planData.comidas.findIndex(c => c === meal);
    if(mainIndex > -1) {
      planData.comidas.splice(mainIndex, 1);
    }
  }
}

// Función de envío del formulario
async function handleSubmit() {
  const { valid } = await form.value.validate();
  if (!valid) return;

  loading.value = true;
  console.log("Enviando los siguientes datos al backend:");
  
  // Limpiamos comidas que puedan estar vacías antes de enviar
  const finalPayload = {
    ...planData,
    comidas: planData.comidas.filter(c => c.alimentos.length > 0)
  };
  
  console.log(JSON.stringify(finalPayload, null, 2));

  // Aquí iría tu llamada a la API con axios o fetch
  // try {
  //   const response = await axios.post('/api/plans', finalPayload);
  //   // Manejar respuesta exitosa (ej. mostrar snackbar, redirigir)
  // } catch (error) {
  //   // Manejar error (ej. mostrar snackbar de error)
  // } finally {
  //   loading.value = false;
  // }

  // Simulación de la llamada
  setTimeout(() => {
    loading.value = false;
    alert("Plan guardado con éxito (ver consola para el JSON)");
  }, 1500);
}

// --- FUNCIONES DE AYUDA Y COMPUTADAS ---

// Propiedad computada para obtener los alimentos de una comida específica
const getAlimentosForMeal = (diaIndex, tipoComida) => {
  const meal = planData.comidas.find(
    c => c.dia_semana === diaIndex + 1 && c.tipo_comida === tipoComida
  );
  return meal ? meal.alimentos : [];
};

// Función para encontrar el nombre de un alimento por su ID (para mostrar en la lista)
const findAlimentoById = (id) => {
  return alimentos.value.find(a => a.id === id);
};

// Función para actualizar el objeto temporal del alimento seleccionado
// Necesario porque v-autocomplete con objetos puede ser complejo
const updateTemporalAlimento = (diaIndex, tipoComida, selectedId) => {
  if (selectedId) {
    const alimentoCompleto = findAlimentoById(selectedId);
    alimentoTemporal.value[diaIndex][tipoComida] = alimentoCompleto;
  } else {
    alimentoTemporal.value[diaIndex][tipoComida] = { id: null };
  }
};


// --- SIMULACIÓN DE API ---

function fetchMockData() {
  // Datos de muestra para pacientes
  pacientes.value = [
    { id: 42, nombreCompleto: 'Juan Pérez' },
    { id: 43, nombreCompleto: 'Ana García' },
    { id: 44, nombreCompleto: 'Carlos Rodríguez' },
  ];

  // Datos de muestra para alimentos
  alimentos.value = [
    { id: 15, nombre: 'Pechuga de Pollo', categoria: 'Carnes' },
    { id: 102, nombre: 'Arroz Blanco Cocido', categoria: 'Cereales' },
    { id: 25, nombre: 'Brócoli', categoria: 'Verduras' },
    { id: 33, nombre: 'Salmón a la plancha', categoria: 'Pescados' },
    { id: 50, nombre: 'Manzana Fuji', categoria: 'Frutas' },
    { id: 51, nombre: 'Avena en hojuelas', categoria: 'Cereales' },
    { id: 52, nombre: 'Huevo cocido', categoria: 'Huevos' },
    { id: 53, nombre: 'Yogur Griego Natural', categoria: 'Lácteos' },
  ];
}
</script>

<style scoped>
/* Estilos opcionales para mejorar la apariencia */
.v-card-title.bg-primary {
  color: white;
}
.v-expansion-panel-text {
  background-color: #f9f9f9;
}
</style>