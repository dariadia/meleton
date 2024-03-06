<template>
  <v-alert :color="event.color" dense dismissible elevation="2" icon="mdi-account" outlined prominent shaped text>
    You have – {{ event.name }} – in {{ dueTime }} minutes!
   <v-container>{{ event.desc }}</v-container>
  </v-alert>
</template>

<script>
export default {
  props: ['event', 'dueTime'],
}
</script>
