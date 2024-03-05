<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <div class="text-h3 mb-4 text-center">Meleton: My Calendar</div>
      <Alert />
      <Calendar />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    localStorageKey: "calendarEvents",
    hasDue: [],
  }),
  mounted() {
    const _data = localStorage.getItem(this.localStorageKey)
    if (!_data) return
    const _events = JSON.parse(_data)

    const checkTime = (date) => {
      const HOUR = 1000 * 60 * 60
      const anHourAhead = Date.now() - HOUR
      return date < anHourAhead
    }

    console.log(_events.filter(event => checkTime(event.start)))

  },
}
</script>
