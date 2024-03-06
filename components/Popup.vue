<template>
  <v-dialog @click:outside="closePopup" v-model="isOpen" max-width="500">
    <v-card>
      <v-container>
        <v-form ref="eventInputs"
          @submit.prevent="addEvent({ ...event, start: event.start || eventStart, callback: closePopup, validate })"
          lazy-validation>
          <v-text-field v-model="event.name" :rules="rules.name" type="text" label="Event title (*)"></v-text-field>
          <v-text-field counter="300" v-model="event.desc" :rules="rules.desc" type="text"
            label="Notification text (*)"></v-text-field>
          <v-combobox :items="names" v-model="event.eventType" :rules="rules.basic" vuetifyjs="primary"
            label="Choose event type (*)" @blur="getEventType"></v-combobox>
          <v-text-field @change="getTime" :rules="rules.basic" v-model="eventStart" min="1970-00-00T00:00"
            max="2100-01-01T00:00" type="datetime-local" label="Start (*)"></v-text-field>
          <v-text-field v-model="event.end" min="1970-00-00T00:00" max="2100-01-01T00:00" type="datetime-local"
            :rules="rules.basic" :class="{ 'error--text': isStartEndErr }" label="End (*)"></v-text-field>
            <v-container class="error--text px-0" v-if="isStartEndErr">Your event should end after it starts!</v-container>
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
  props: ['closeDialog', 'popup', 'names', 'addEvent', 'defaultStart', 'rules', 'isStartEndErr'],
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
    validate() {
      this.$refs.eventInputs.validate()
    },
    closePopup() {
      this.event = {
        name: null,
        desc: null,
        eventType: null,
        end: null,
      }
      this.$refs.eventInputs.reset()
      this.closeDialog()
    },
    /* Similar as above.
     When user has no pre-filled datetime and fills it out manually the last of all fields,
     this param fails to pick up the time, just the date.
    */
    getTime(event) {
      this.event.start = event.replace("T", " ")
    }
  }
}
</script>
