<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="10">
      <v-container class="text-h3 mb-4 text-center">Meleton: My Calendar</v-container>
      <v-container>
        <Alert v-for="item in hasDue" :key="item.id" :event="item" :dueTime="dueTime" />
      </v-container>
      <Calendar :checkIfHasDue="checkIfHasDue" :localStorageKey="localStorageKey" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    localStorageKey: "calendarEvents",
    hasDue: [],
    interval: null,
    dueTime: null,
  }),
  mounted() {
    const MINUTE = 60 * 1000
    this.checkIfHasDue()
    this.interval = setInterval(() => this.checkIfHasDue(), MINUTE)
  },
  onBeforeUnmount() {
    clearInterval(this.interval)
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
      
      if (this.hasDue.length) {
        /* simplification: We could run this inside <Alert /> 
        but I would rather not have two separate intervals running */
        this.hasDue.forEach(event => this.calcDue(event))
      }
    },
    calcDue(event) {
      let nowDate = new Date()
      let achiveDate = new Date(event.start)
      var result = (achiveDate - nowDate) + 1000
      var minutes = Math.floor((result / 1000 / 60) % 60)
      if (minutes < 10) minutes = '0' + minutes
      this.dueTime = minutes
    }
  }
}
</script>
