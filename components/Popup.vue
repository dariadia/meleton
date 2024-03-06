<template>
  <v-dialog @click:outside="closePopup" v-model="isOpen" max-width="500">
    <v-card>
      <v-container>
        <v-form @submit.prevent="addEvent({ ...event, start: event.start || eventStart, callback: closePopup })">
          <v-text-field v-model="event.name" type="text" label="Event title (*)"></v-text-field>
          <v-text-field counter="300" v-model="event.desc" type="text" label="Notification text (*)"></v-text-field>
          <v-combobox :items="names" v-model="event.eventType" vuetifyjs="primary" label="Choose event type (*)"
            @blur="getEventType"></v-combobox>
          <v-text-field @change="getTime" v-model="eventStart" min="1970-00-00T00:00" max="2100-01-01T00:00"
            type="datetime-local" label="Start (*)"></v-text-field>
          <v-text-field v-model="event.end" min="1970-00-00T00:00" max="2100-01-01T00:00" type="datetime-local"
            label="End (*)"></v-text-field>
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
  props: ['closeDialog', 'popup', 'names', 'addEvent', 'defaultStart'],
  data: () => ({
    event: {
      name: null,
      desc: null,
      eventType: null,
      end: null,
      start: null,
    },
  }),
  computed: {
    isOpen: {
      get() { return this.popup },
      set(value) {
        this.$emit('update:popup', value)
      },
    },
    eventStart: {
      get() { return this.defaultStart },
      set(value) {
        this.$emit('update:defaultStart', value)
      },
    }
  },
  methods: {
    /* When user fills out eventType manually and the last of all fields,
     v-combobox updates the v-model item only on the next re-render. 
     Might be a corner-case. Need to research vue-spefics.
     Update the value via the blur method.
    */
    getEventType(event) {
      this.event.eventType = event.target.value
    },
    closePopup() {
      this.event = {
        name: null,
        desc: null,
        eventType: null,
        end: null,
      }
      this.closeDialog()
    },
    /* Similar as above.
     When user has no pre-filled datetime and fills it out manually the last of all fields,
     this param fails to pick up the time, just the date.
    */
    getTime(event) {
      this.event.start = event.replace("T", " ")
      console.log(this.defaultStart, this.event.start, this.eventStart)
    }
  }
}
</script>
