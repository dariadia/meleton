<template>
  <v-alert :color="event.color" dense dismissible elevation="2" icon="mdi-account" outlined prominent shaped text>
    You have – {{ event.name }} – in {{ dueTime }} minutes!
    <v-container>{{ event.desc }}</v-container>
  </v-alert>
</template>

<script>
export default {
  props: ['event', 'shouldUpdate'],
  watch: {
    shouldUpdate () {
      this.calcDue()
    }
  },
  data: () => ({
    dueTime: null,
    checkInterval: null,
    MINUTE: 60 * 1000,
  }),
  mounted() {
    this.calcDue()
    this.checkInterval = setInterval(this.calcDue, this.MINUTE)
  },
  onBeforeUnmount() {
    clearInterval(this.checkInterval)
  },
  methods: {
    calcDue() {
      let nowDate = new Date()
      let achiveDate = new Date(this.event.start)
      var result = (achiveDate - nowDate) + 1000
      var minutes = Math.floor((result / 1000 / 60) % 60)
      if (minutes < 10) minutes = '0' + minutes
      this.dueTime = minutes
    }
  }
}
</script>
