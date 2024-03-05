<template>
  <v-row class="fill-height pb-14">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn color="primary" @click.stop="popup = true" class="mr-4">
            New Event
          </v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-dialog v-model="popup" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
              <v-text-field v-model="desc" type="text" label="Event description (*)"></v-text-field>
              <v-combobox :items="names" v-model="eventType" vuetifyjs="primary"
                label="Choose event type (*)"></v-combobox>
              <v-text-field v-model="start" type="datetime-local" label="Start (*)"></v-text-field>
              <v-text-field v-model="end" type="datetime-local" label="End (*)"></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4">
                create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <v-dialog v-model="popupDate" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              {{ start }}
              <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
              <v-text-field v-model="desc" type="text" label="Event description (*)"></v-text-field>
              <v-combobox :items="names" v-model="eventType" vuetifyjs="primary"
                label="Choose event type (*)"></v-combobox>
              <v-text-field v-model="start" type="datetime-local" label="Start (*)"></v-text-field>
              <v-text-field v-model="end" type="datetime-local" label="End (*)"></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4">
                create event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>
      <v-sheet height="600">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
          :event-margin-bottom="3" :now="today" :type="type" @click:event="showEvent" @click:more="viewDay"
          @click:date="setPopupDate" @change="updateRange"></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.desc"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    eventSeparator: "//",
    localStorageKey: "calendarEvents",
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    weekday: [1, 2, 3, 4, 5, 6, 0],
    name: null,
    desc: null,
    eventType: null,
    start: null,
    end: null,
    selectedEvent: {},
    currentlyEditing: null,
    selectedElement: null,
    selectedOpen: false,
    events: [],
    popup: false,
    popupDate: false,
    colors: ['deep-purple lighten-3', 'red lighten-3', 'cyan darken-4', 'cyan darken-1', 'amber', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'Travel', 'Personal event', 'Birthday', 'Conference', 'Party'],
  }),
  mounted() {
    this.$refs.calendar.checkChange()
    this.getEvents()
  },
  methods: {
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = ''
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    getEventColor (event) {
        return event.color
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
    getEvents ({ start, end }) {
        const events = []

        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000
        const eventCount = this.rnd(days, days + 20)

        for (let i = 0; i < eventCount; i++) {
          const allDay = this.rnd(0, 3) === 0
          const firstTimestamp = this.rnd(min.getTime(), max.getTime())
          const first = new Date(firstTimestamp - (firstTimestamp % 900000))
          const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
          const second = new Date(first.getTime() + secondTimestamp)

          events.push({
            name: this.names[this.rnd(0, this.names.length - 1)],
            start: first,
            end: second,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            timed: !allDay,
          })
        }

        this.events = events
      },
    // getEvents() {
    //   let events = []
    //   const _data = localStorage.getItem(this.localStorageKey)
    //   if (!_data) return
    //   events = [JSON.parse(_data)]
    //   this.events = events
    //   console.log(9, this.events)
    // },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else open()

      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    },
    setPopupDate({ date }) {
      this.popupDate = true
      this.focus = date

      // User already clicks on a date, so use it as a prefilled field
      // Set time to the current time
      const now = new Date()
      const minutes = now.getMinutes()
      this.start = `${date}T:${now.getHours()}:${minutes >= 10 ? minutes : `0${minutes}`}`
    },
    setToLocalStorage() {
      localStorage.setItem(this.localStorageKey, this.stringifyEvents())
    },
    stringifyEvents() {
      return this.events.map(event => JSON.stringify(event)).join(this.eventSeparator)
    },
    addEvent() {
      // Some basic check-up. No special symbols in event names.
      const isValueValid = (value) => /[^ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)
      const isNameValid = this.name && isValueValid(this.name)

      const isDescValid = this.desc && this.desc.length <= 300

      // Check that date and time are filled out
      // When not filled out e.g. this.date === function
      // There should be a neater sollution, should check out more vuetifyjs docs
      // If user enters, e.g., 80:99 => the vuetifyjs element itself converts it to valid time
      const isDateValid = (date) => date && typeof date === 'string'
      // Other data just has to be there. We could add more checks if needed.
      const isValid = isNameValid && isDescValid
        && isDateValid(this.start) && isDateValid(this.end)
        && this.eventType && this.start < this.end

      if (isValid) {
        // simplification: use the timestamp when this event was created as its id
        this.events.push({
          id: Date.now(),
          name: this.name,
          desc: this.desc,
          start: this.start,
          end: this.end,
          eventType: this.eventType
        })
        this.setToLocalStorage()
        this.name = '',
          this.desc = '',
          this.eventType = '',
          this.start = '',
          this.end = ''

        this.popup = false
        this.popupDate = false
        alert("Success! Event has been added.")
      } else {
        const message = 'Please check that you have filled out these fields:'
        let _message = []
        if (!isNameValid) _message.push('event name')
        if (!this.desc) _message.push('event description')
        if (!this.eventType) _message.push('event event type')
        if (!isDateValid(this.start)) _message.push('event start date')
        if (!isDateValid(this.end)) _message.push('event end date')
        const extraMessage = this.desc?.length > 300 ? "Event description must be shorter!": ''
        const extraTimeMessage = this.start < this.end ? "Your end should end after it starts!": ''

        // simplification: just alert all the errors together
        // preferrably: set each error as message below its corresponding field
        alert(`${message}\n${_message.join("\n")}\n\n${extraMessage}\n\n${extraTimeMessage}`)
      }
    },
    editEvent(event) {
      this.currentlyEditing = event.id
    },
    async deleteEvent(event) {
      this.events = this.events.filter(_event => _event.id !== event.id)
      this.setToLocalStorage()
      this.selectedOpen = false
      this.getEvents()
    },
  },
}
</script>
