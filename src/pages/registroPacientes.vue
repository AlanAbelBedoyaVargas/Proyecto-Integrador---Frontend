<template>
  <v-container>
    <v-form @submit.prevent="registrarPaciente" ref="formulario">
      <v-card
        class="mx-auto"
        max-width="800"
        title="Formulario de Registro de Pacientes"
        elevation="2"
      >
        <v-card-text>
          <v-row>
            <!-- ID Usuario (Asumiendo que se ingresa manualmente o se obtiene de la sesión) -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="paciente.id_usuario"
                label="ID de Usuario"
                type="number"
                variant="outlined"
                :rules="[reglas.requerido]"
                hint="ID del usuario asociado a este paciente"
              ></v-text-field>
            </v-col>

            <!-- ID Nutricionista (Selector) -->
            <v-col cols="12" md="6">
              <v-select
                v-model.number="paciente.id_nutricionista"
                :items="nutricionistas"
                item-title="nombre"
                item-value="id"
                label="Nutricionista Asignado"
                variant="outlined"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-col>

            <!-- Fecha de Nacimiento (con Menú de Calendario) -->
            <v-col cols="12" md="6">
                <v-text-field
                  v-model="paciente.fechaNacimiento"
                  label="Fecha de Nacimiento"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  variant="outlined"
                  :rules="[reglas.requerido]"
                  @click="menuFechaNacimiento = true"
                ></v-text-field>
                <v-dialog v-model="menuFechaNacimiento" width="auto">
                    <v-date-picker
                        v-model="fechaNacimientoProxy"
                        title="Seleccione la fecha"
                        @update:modelValue="menuFechaNacimiento = false"
                    ></v-date-picker>
                </v-dialog>
            </v-col>

            <!-- Sexo (Selector) -->
            <v-col cols="12" md="6">
              <v-select
                v-model="paciente.sexo"
                :items="['masculino', 'femenino']"
                label="Sexo"
                variant="outlined"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-col>

            <!-- Peso -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="paciente.peso_kg"
                label="Peso"
                type="number"
                suffix="kg"
                variant="outlined"
                :rules="[reglas.requerido, reglas.decimal]"
              ></v-text-field>
            </v-col>

            <!-- Altura -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="paciente.altura_cm"
                label="Altura"
                type="number"
                suffix="cm"
                variant="outlined"
                :rules="[reglas.requerido, reglas.decimal]"
              ></v-text-field>
            </v-col>

            <!-- ID Actividad (Selector) -->
            <v-col cols="12">
               <v-select
                v-model.number="paciente.id_actividad"
                :items="nivelesActividad"
                item-title="descripcion"
                item-value="id"
                label="Nivel de Actividad Física"
                variant="outlined"
                :rules="[reglas.requerido]"
              ></v-select>
            </v-col>

            <!-- Objetivo -->
            <v-col cols="12">
              <v-textarea
                v-model="paciente.objetivo"
                label="Objetivo Principal"
                variant="outlined"
                rows="2"
                hint="Ej: Perder peso, ganar masa muscular, mejorar hábitos, etc."
              ></v-textarea>
            </v-col>

            <!-- Restricciones -->
            <v-col cols="12">
              <v-textarea
                v-model="paciente.restricciones_alimentarias"
                label="Restricciones Alimentarias"
                variant="outlined"
                rows="3"
                hint="Ej: Sin gluten, bajo en sodio, vegetariano, etc."
              ></v-textarea>
            </v-col>
            
            <!-- Condición Médica -->
             <v-col cols="12">
              <v-textarea
                v-model="paciente.condicion_medica"
                label="Condición Médica Relevante"
                variant="outlined"
                rows="3"
                hint="Ej: Diabetes tipo 2, hipertensión, hipotiroidismo, etc."
              ></v-textarea>
            </v-col>

            <!-- Alergias -->
            <v-col cols="12">
              <v-textarea
                v-model="paciente.alergias"
                label="Alergias"
                variant="outlined"
                rows="3"
                hint="Ej: Alergia a los frutos secos, mariscos, etc."
              ></v-textarea>
            </v-col>

            <!-- Intolerancias -->
            <v-col cols="12">
              <v-textarea
                v-model="paciente.intolerancias"
                label="Intolerancias"
                variant="outlined"
                rows="3"
                hint="Ej: Intolerancia a la lactosa, al gluten, etc."
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="limpiarFormulario">Limpiar</v-btn>
          <v-btn color="primary" type="submit" variant="elevated">Registrar Paciente</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

// --- REFERENCIA AL FORMULARIO ---
const formulario = ref(null);

// --- ESTADO DEL FORMULARIO (DATOS DEL PACIENTE) ---
// Usamos reactive para un objeto anidado
const paciente = reactive({
  id_usuario: null,
  id_nutricionista: null,
  fechaNacimiento: null,
  sexo: null,
  peso_kg: null,
  altura_cm: null,
  objetivo: '',
  restricciones_alimentarias: '',
  condicion_medica: '',
  alergias: '',
  intolerancias: '',
  id_actividad: null
});

// --- DATOS PARA SELECTORES (DROPDOWNS) ---
// Estos datos normalmente vendrían de una API
const nutricionistas = ref([
  { id: 1, nombre: 'Dr. Carlos Sánchez' },
  { id: 2, nombre: 'Dra. Ana Gómez' },
  { id: 3, nombre: 'Dra. Sofía Castillo' }
]);

const nivelesActividad = ref([
    { id: 1, descripcion: 'Sedentario (poco o ningún ejercicio)' },
    { id: 2, descripcion: 'Ligero (ejercicio 1-3 días/semana)' },
    { id: 3, descripcion: 'Moderado (ejercicio 3-5 días/semana)' },
    { id: 4, descripcion: 'Activo (ejercicio 6-7 días/semana)' },
    { id: 5, descripcion: 'Muy activo (ejercicio duro y trabajo físico)' },
]);


// --- LÓGICA PARA EL SELECTOR DE FECHA ---
const menuFechaNacimiento = ref(false);

// Un proxy computado para manejar el formato de la fecha del v-date-picker
const fechaNacimientoProxy = computed({
  get: () => paciente.fechaNacimiento ? new Date(paciente.fechaNacimiento) : null,
  set: (val) => {
    if (val) {
      paciente.fechaNacimiento = val.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    } else {
      paciente.fechaNacimiento = null;
    }
  }
});
</script>
