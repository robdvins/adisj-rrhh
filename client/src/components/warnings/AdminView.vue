<template>
  <div class="mt-10">
    <div class="container">
      <div class="columns is-multiline">
        <div class="column is-3">
          <div class="box">
            <h5 class="title is-5">Nueva amonestación</h5>
            <ValidationObserver ref="observer" v-slot="{ invalid, reset }" tag="div" class="columns is-multiline">
              <ValidationProvider rules="required" v-slot="{ errors }" tag="div" class="column is-full">
                <b-field label="Empleado" :message="errors" :type="{ 'is-danger': errors[0] }">
                  <b-autocomplete
                    v-model="nombre"
                    :data="filteredDataArray"
                    :open-on-focus="true"
                    dropdown-position="bottom"
                    field="nombre_completo"
                    @select="option => (selectedEmployee = option)"
                    placeholder="Buscar empleado"
                  >
                  </b-autocomplete>
                </b-field>
              </ValidationProvider>

              <ValidationProvider
                :rules="{ required: true, alpha_spaces: /^[a-zA-Z\sñáéíóú]*$/ }"
                v-slot="{ errors, valid }"
                tag="div"
                class="column is-full"
              >
                <b-field
                  label="Motivo"
                  :message="errors"
                  :type="{ 'is-danger': errors[0], 'is-success': valid }"
                  expanded
                >
                  <b-input v-model="reason"></b-input>
                </b-field>
              </ValidationProvider>

              <div class="column is-full">
                <b-button
                  type="is-primary"
                  @click="
                    applyWarning();
                    reset();
                  "
                  :disabled="invalid"
                  expanded
                  >Aplicar amonestación</b-button
                >
              </div>
              <div class="column is-full"></div>
              <div class="column is-full">
                <b-button type="is-info" @click="genReport" expanded>Generar</b-button>
              </div>
            </ValidationObserver>
          </div>
        </div>

        <div class="column is-9">
          <div class="box">
            <h5 class="title is-5">Amonestaciones aplicadas</h5>
            <b-table
              :data="warnings"
              :narrowed="true"
              :paginated="true"
              :per-page="4"
              :hoverable="true"
              default-sort-direction="desc"
              default-sort="fecha"
              height="294"
            >
              <template slot-scope="props">
                <b-table-column label="Empleado" field="empleado" :searchable="true" width="200">
                  {{ props.row.empleado }}
                </b-table-column>

                <b-table-column label="Motivo" width="200">
                  {{ props.row.descripcion }}
                </b-table-column>

                <b-table-column label="Fecha" field="fecha" width="120" sortable centered>
                  <b-tag type="is-light">{{ formatDate(props.row.fecha) }}</b-tag>
                </b-table-column>
              </template>

              <template slot="empty">
                <section class="section">
                  <div class="content has-text-grey has-text-centered">
                    <p>
                      <b-icon icon="emoticon-sad" size="is-large"> </b-icon>
                    </p>
                    <p>No se han aplicado amonestaciones.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import Service from '@/services/AdisjService.js';
import { format } from 'date-fns';

export default {
  name: 'Withholding',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      nombre: '',
      selectedEmployee: null,
      reason: '',
      warnings: [],
    };
  },
  computed: {
    ...mapGetters('employees', ['employeesForAutocomplete']),
    formatDate() {
      return date => format(new Date(date), 'dd/MM/yyyy');
    },
    filteredDataArray() {
      return this.employeesForAutocomplete.filter(employee => {
        return (
          employee.nombre_completo
            .toString()
            .toLowerCase()
            .indexOf(this.nombre.toLowerCase()) >= 0
        );
      });
    },
  },
  methods: {
    async applyWarning() {
      try {
        await Service.postWarning(
          JSON.stringify({
            id_empleado: this.selectedEmployee.id,
            descripcion: this.reason,
          })
        );

        const { data } = await Service.getWarnings();
        this.warnings = data;

        this.reason = '';

        this.$buefy.toast.open({
          duration: 2500,
          message: 'Amonestación registrada',
          type: 'is-success',
        });
      } catch (error) {
        this.$buefy.toast.open({
          duration: 2500,
          message: 'No se pudo registrar la amonestación',
          type: 'is-danger',
        });
      }
    },
    async genReport() {
      try {
        const { data } = await Service.genQualityReport();

        const fileURL = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'REPORTE-AMONESTACIONES-FELICITACIONES.pdf');
        document.body.appendChild(fileLink);
        fileLink.click();
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    this.$store.dispatch('employees/fetchEmployees');
    const { data } = await Service.getWarnings();
    this.warnings = data;
  },
};
</script>
