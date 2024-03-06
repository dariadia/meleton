<template>
  <v-dialog v-model="isPickerOpen" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on">
        Set M/Y
      </v-btn>
    </template>
    <v-card>
      <v-date-picker full-width v-model="dateInView" @change="goToDate" class="mt-4"></v-date-picker>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['isOpen', 'setFocus'],
  data: () => ({
    dateInView: new Date().toISOString().substr(0, 10),
  }),
  computed: {
    isPickerOpen: {
      get() { return this.isOpen },
      set(value) { this.$emit('update:isOpen', value) },
    },
  },
  methods: {
    goToDate() {
      this.setFocus(this.dateInView)
    },
  }
}
</script>
