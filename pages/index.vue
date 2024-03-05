<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <div class="text-h3 mb-4 text-center">Meleton: My Calendar</div>
      <div>
        <Alert v-for="item in hasDue" :key="item.id" :event="item" />
      </div>
      <Calendar :checkIfHasDue="checkIfHasDue" />
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
    this.checkIfHasDue()
  },
  methods: {
    checkIfHasDue() {
      const _data = localStorage.getItem(this.localStorageKey)
      if (!_data) return
      const _events = JSON.parse(_data)

      const checkTime = (date) => {
        const HOUR = 1000 * 60 * 60
        const _date = new Date(date)
        const isFuture = Date.now() - _date <= 0
        return isFuture ? _date - HOUR <= Date.now() : _date + HOUR <= Date.now()
      }
      this.hasDue = _events.filter(event => checkTime(event.start))
    }
  }
}
</script>
