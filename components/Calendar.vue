<template>
  <v-row class="fill-height pb-14">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn class="mr-4" color="primary" @click.stop="popup = true">
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
          <v-toolbar-title v-if="$refs.calendar">{{ $refs.calendar.title }}</v-toolbar-title>
          <v-row class="ml-4">
            <v-dialog v-model="monthYearPicker" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" v-bind="attrs" v-on="on">
                  Set M/Y
                </v-btn>
              </template>
              <v-card>
                <v-date-picker full-width v-model="dateInView" @change="goToDate" class="mt-4"></v-date-picker>
              </v-card>
            </v-dialog>
          </v-row>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined v-on="on">
                <v-container tag="span">{{ typeToLabel[type] }}</v-container>
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
      <v-dialog @click:outside="closeDialog" v-model="popup" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
              <v-text-field counter="300" v-model="desc" type="text" label="Notification text (*)"></v-text-field>
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
      <v-dialog v-model="popupDate" @click:outside="closeDialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field v-model="name" type="text" label="Event title (*)"></v-text-field>
              <v-text-field counter="300" v-model="desc" type="text" label="Notification text (*)"></v-text-field>
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
          @click:time="setPopupDate" @click:date="setPopupDate" @change="updateRange"></v-calendar>
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
            </v-toolbar>
            <v-card-text>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id">{{ new Date(selectedEvent.start)?.toDateString()
                }}</v-container>
              <v-text-field v-else v-model="selectedEvent.start" type="datetime-local" label="Start (*)"></v-text-field>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id"> – </v-container>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id">{{ new Date(selectedEvent.end)?.toDateString()
                }}</v-container>
              <v-text-field v-else v-model="selectedEvent.end" type="datetime-local" label="End (*)"></v-text-field>
              <v-divider></v-divider>
              <v-container v-if="currentlyEditing !== selectedEvent.id">{{ selectedEvent.eventType }}</v-container>
              <v-combobox v-else :items="names" v-model="selectedEvent.eventType" vuetifyjs="primary"
                label="Choose event type (*)"></v-combobox>
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
  props: ['checkIfHasDue'],
  data: () => ({
    localStorageKey: "calendarEvents",
    dateInView: new Date().toISOString().substr(0, 10),
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    monthYearPicker: false,
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
    colors: [
      'deep-purple lighten-3',
      'red lighten-3',
      'cyan darken-4',
      'cyan darken-1',
      'amber',
      'grey darken-1',
    ],
    names: [
      'Meeting',
      'Holiday',
      'Travel',
      'Personal event',
      'Birthday',
      'Conference',
      'Party',
    ],
  }),
  mounted() {
    this.getEvents()
  },
  methods: {
    getEvents() {
      const _data = localStorage.getItem(this.localStorageKey)
      if (!_data) return
      this.events = JSON.parse(_data)
    },
    goToDate() {
      this.focus = this.dateInView
    },
    setPopupDate({ date, time }) {
      this.popupDate = true
      this.focus = date
      this.start = `${date} ${time || "00:00"}`
    },
    viewDay({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor(event) {
      return event.color
    },
    closeDialog() {
      this.name = '',
        this.desc = '',
        this.eventType = '',
        this.start = '',
        this.end = ''
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
    validateFields({ name, desc, start, end, eventType }) {
      // Some basic check-up. No special symbols in event names.
      const isValueValid = (value) => /[^ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)
      const isNameValid = name?.trim() && isValueValid(name)

      const isDescValid = desc && desc.length <= 300

      /* Check that date and time are filled out
         When not filled out e.g. this.date === function
         There should be a neater sollution, should check out more vuetifyjs docs
         If user enters, e.g., 80:99 => the vuetifyjs element itself converts it to valid time 
      */
      const isDateValid = (date) => date && typeof date === 'string'
      // Other data just has to be there. We could add more checks if needed.
      const isValid = isNameValid && isDescValid
        && isDateValid(start) && isDateValid(end)
        && eventType && start < end

      return { isNameValid, isDescValid, isDateValid, isValid }
    },
    addEvent() {
      const { isNameValid, isDateValid, isValid } = this.validateFields({ name: this.name, desc: this.desc, start: this.start, end: this.end, eventType: this.eventType })

      if (isValid) {
        const _start = this.start?.split("T")
        const _end = this.end?.split("T")

        // simplification: use the timestamp when this event was created as its id
        this.events.push({
          id: Date.now(),
          name: this.name,
          desc: this.desc,
          // simplification: caused by https://github.com/dariadia/meleton/pull/2#issuecomment-1979142190
          start: `${_start[0]} ${_start[1]}`,
          end: `${_end[0]} ${_end[1]}`,
          eventType: this.eventType,
          // simplification: each event type is paired with a colour
          // user-input-ed event types default to the first colour
          color: this.getColor(this.eventType),
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
        this._props.checkIfHasDue()
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
    getColor(eventType) {
      const colorInx = this.names.indexOf(eventType)
      return this.colors[colorInx >= 0 ? colorInx : 0]
    },
    updateEvent(event) {
      const { isValid } = this.validateFields({ name: event.name, desc: event.desc, start: event.start, end: event.end, eventType: event.eventType })
      /* simplification: same as in the "addEvent" method
         preferrably: set each error as message below its corresponding field */
      if (!isValid) return alert('Please check how you filled out the event details')

      this.events = this.events.map(_event => _event.id !== event.id ? _event : { ...event, color: this.getColor(event.eventType) })
      this.setToLocalStorage()
      this.selectedOpen = false
      this.currentlyEditing = null
      this.getEvents()
      this._props.checkIfHasDue()
    },
    deleteEvent(event) {
      this.events = this.events.filter(_event => _event.id !== event)
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
