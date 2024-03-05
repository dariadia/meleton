<template>
  <v-dialog v-model="popupDate" max-width="500">
    <v-card>
      <v-container>
        <v-form @submit.prevent="addEvent">
          <v-text-field v-model="name" type="text" label="event name (required)"></v-text-field>
          <v-text-field v-model="desc" type="text" label="Description"></v-text-field>
          <v-text-field v-model="start" type="date" label="start (required)"></v-text-field>
          <v-text-field v-model="end" type="date" label="end (required)"></v-text-field>
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
  props: ['popupDate', 'name', 'end', 'start', 'desc'],
}
</script>
