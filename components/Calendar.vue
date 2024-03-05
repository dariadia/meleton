<template>
  <v-row class="fill-height pb-14">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn class="mr-4" color="primary" dark @click.stop="popup = true">
            New Event
          </v-btn>
          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
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
              <v-text-field counter="300" v-model="desc" type="text" label="Notification text (*)"></v-text-field>
              <v-combobox :items="names" v-model="eventType" vuetifyjs="primary"
                label="Choose event type (*)"></v-combobox>
              <v-text-field v-model="start" type="date" label="Start (*)"></v-text-field>
              <v-text-field v-model="end" type="date" label="End (*)"></v-text-field>
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
              <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
              <v-text-field counter="300" v-model="desc" type="text" label="Notification text (*)"></v-text-field>
              <v-combobox :items="names" v-model="eventType" vuetifyjs="primary"
                label="Choose event type (*)"></v-combobox>
              <v-text-field v-model="start" type="date" label="Start (*)"></v-text-field>
              <v-text-field v-model="end" type="date" label="End (*)"></v-text-field>
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
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" full-width offset-x>
          <v-card color="grey lighten-4" :width="350" flat>
            <v-toolbar :color="selectedEvent.color">
              <v-btn @click="deleteEvent(selectedEvent.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.name }}
              </v-toolbar-title>
              <v-toolbar-title v-else>
                <v-textarea class="pt-4" v-model="selectedEvent.name" type="text" rows="1"
                  placeholder="Change event name" background-color="grey lighten-2"></v-textarea>
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.desc }}
              </form>
              <form v-else>
                <v-textarea v-model="selectedEvent.desc" type="text" rows="3" placeholder="Change notification text">
                </v-textarea>
              </form>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                close
              </v-btn>
              <v-btn v-if="currentlyEditing !== selectedEvent.id" text @click.prevent="editEvent(selectedEvent)">
                edit
              </v-btn>
              <v-btn text v-else type="submit" @click.prevent="updateEvent(selectedEvent)">
                Save
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
    currentlyEditing: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    popup: false,
    popupDate: false,
    colors: ['deep-purple lighten-3', 'red lighten-3', 'cyan darken-4', 'cyan darken-1', 'amber', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'Travel', 'Personal event', 'Birthday', 'Conference', 'Party'],
  }),
  mounted() {
    this.getEvents()
  },
  computed: {
    title() {
      const { start, end } = this
      if (!start || !end) return ''
      console.log(this.type)
      const startMonth = this.monthFormatter(start)
      const startYear = start.year
      const startDay = start.day + start.day
      switch (this.type) {
        case 'month':
          return `${startMonth} ${startYear}`
        case 'week':
        case 'day':
          return `${startMonth} ${startDay} ${startYear}`
      }
      return ''
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: 'UTC', month: 'long',
      })
    }
  },
  methods: {
    getEvents() {
      const _data = localStorage.getItem(this.localStorageKey)
      if (!_data) return
      this.events = JSON.parse(_data)
    },
    setPopupDate({ date }) {
      this.popupDate = true
      this.focus = date
      this.start = date
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    setToday() {
      this.focus = this.today
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    setToLocalStorage() {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.events))
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
          eventType: this.eventType,
          timed: false,
          // simplification: each event type is paired with a colour
          // user-input-ed event types default to the first colour
          color: this.colors[this.names.indexOf(this.eventType) || 0],
        })
        this.setToLocalStorage()

        this.name = '',
          this.desc = '',
          this.eventType = '',
          this.start = '',
          this.end = ''

        this.popup = false
        this.popupDate = false
        this.getEvents()
        alert("Success! Event has been added.")
      } else {
        const message = 'Please check that you have filled out these fields:'
        let _message = []
        if (!isNameValid) _message.push('event name')
        if (!this.desc) _message.push('notification text')
        if (!this.eventType) _message.push('event event type')
        if (!isDateValid(this.start)) _message.push('event start date')
        if (!isDateValid(this.end)) _message.push('event end date')
        const extraMessage = this.desc?.length > 300 ? "Event notification must be shorter!" : ''
        const extraTimeMessage = this.start > this.end ? "Your event should end after it starts!" : ''

        // simplification: just alert all the errors together
        // preferrably: set each error as message below its corresponding field
        alert(`${message}\n${_message.join("\n")}\n\n${extraMessage}\n\n${extraTimeMessage}`)
      }
    },
    editEvent(event) {
      this.currentlyEditing = event.id
    },
    async updateEvent(event) {
      this.events = this.events.map(_event => _event.id !== event.id ? _event : event)
      this.setToLocalStorage()
      this.selectedOpen = false
      this.currentlyEditing = null
      this.getEvents()
    },
    async deleteEvent(event) {
      this.events = this.events.filter(_event => _event.id !== event.id)
      this.setToLocalStorage()
      this.selectedOpen = false
      this.getEvents()
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => this.selectedOpen = true, 10)
      }
      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else open()
      nativeEvent.stopPropagation()
    },
    updateRange({ start, end }) {
      this.start = start
      this.end = end
    },
  }
}
</script>
