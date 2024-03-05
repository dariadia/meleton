<template>
  <v-alert :color="event.color" ense dismissible elevation="2" icon="mdi-account" outlined prominent shaped text>
    You have – {{ event.name }} – soon!
   <div>{{ event.desc }}</div>
  </v-alert>
</template>

<script>
export default {
  props: ['event'],
}
</script>
