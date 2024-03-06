<template>
  <v-dialog @click:outside="closeDialog" v-model="isOpen" max-width="500">
    <v-card>
      <v-container>
        <v-form @submit.prevent="addEvent">
          <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
          <v-text-field counter="300" v-model="desc" type="text" label="Notification text (*)"></v-text-field>
          <v-combobox :items="names" v-model="eventType" vuetifyjs="primary" label="Choose event type (*)"></v-combobox>
          <v-text-field v-model="start" type="datetime-local" label="Start (*)"></v-text-field>
          <v-text-field v-model="end" type="datetime-local" label="End (*)"></v-text-field>
          <v-btn type="submit" color="primary" class="mr-4">
            create event
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['closeDialog', 'popup', 'names', 'addEvent'],
  data: () => ({
    name: null,
    desc: null,
    eventType: null,
    start: null,
    end: null,
  }),
  computed: {
    isOpen: {
      get() { return this.popup },
      set(value) { this.$emit('update:popup', value) },
    },
  }
}
</script>
