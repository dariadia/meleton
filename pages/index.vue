<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <v-container class="text-h3 mb-4 text-center">Meleton: My Calendar</v-container>
      <v-container>
        <Alert v-for="item in hasDue" :key="item.id" :event="item" :shouldUpdate="shouldUpdate" />
      </v-container>
      <Calendar :checkIfHasDue="checkIfHasDue" :localStorageKey="localStorageKey" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    localStorageKey: "calendar_events",
    hasDue: [],
    interval: null,
    MINUTE: 60 * 1000,
    shouldUpdate: false,
  }),
  mounted() {
    this.checkIfHasDue()
    this.interval = setInterval(this.checkIfHasDue, this.MINUTE)
  },
  onBeforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    checkIfHasDue(shouldUpdate) {
      const _data = localStorage.getItem(this.localStorageKey)
      if (!_data) return
      const _events = JSON.parse(_data)
      const checkTime = (date) => {
        const HOUR = this.MINUTE * 60
        const _date = new Date(date)
        const isFuture = Date.now() - _date <= 0
        return isFuture ? _date - HOUR <= Date.now() : _date + HOUR <= Date.now()
      }
      this.hasDue = _events.filter(event => checkTime(event.start))
      if (shouldUpdate) this.shouldUpdate = true
    }
  }
}
</script>
