<template>
  <v-dialog v-model="popup" max-width="500">
    <v-card>
      <v-container>
        <v-form @submit.prevent="addEvent">
          <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
          <v-text-field v-model="desc" type="text" label="Event description (*)" class="mb-6"></v-text-field>
          event type todo
          <v-text-field v-model="start" type="date" label="Start (*)"></v-text-field>
          <v-text-field v-model="end" type="date" label="End (*)"></v-text-field>
          <v-btn type="submit" color="primary" class="mr-4" @click.stop="popup = false">
            Add new event
          </v-btn>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['popup', 'name', 'end', 'start', 'desc', 'addEvent'],
}
</script>
