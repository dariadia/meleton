<template>
  <v-row class="fill-height pb-14">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn class="mr-4" color="primary" @click.stop="popups.popup = true">
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
            <YearPicker :isOpen="isOpenYearPicker" :setFocus="setFocus" />
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
      <Popup :rules="rules" :closeDialog="closeDialog" :popup="popups.popup" :names="names" :addEvent="addEvent"
        :isStartEndErr="isStartEndErr" />
      <Popup :rules="rules" :closeDialog="closeDialog" :popup="popups.popupDate" :names="names" :addEvent="addEvent"
        :defaultStart="start" :isStartEndErr="isStartEndErr" />
      <v-sheet height="600">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor"
          :event-margin-bottom="3" :now="today" :type="type" @click:event="showEvent" @click:more="viewDay"
          @click:time="setPopupDate" @click:date="setPopupDate" @change="updateRange"></v-calendar>
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" full-width offset-x>
          <v-card color="grey lighten-4" :width="350" flat>
            <v-toolbar :color="selectedEvent.color"">
              <v-btn @click=" deleteEvent(selectedEvent.id)" icon>
              <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.name }}
              </v-toolbar-title>
              <v-toolbar-title v-else>
                <v-textarea class="pt-4" :rules="rules.name" v-model="selectedEvent.name" type="text" rows="1"
                  placeholder="Change event name" background-color="grey lighten-2"></v-textarea>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id">{{ new
            Date(selectedEvent.start)?.toDateString()
                }}</v-container>
              <v-text-field :rules="rules.basic" v-else v-model="selectedEvent.start" min="1970-00-00T00:00"
                max="2100-01-01T00:00" type="datetime-local" label="Start (*)"></v-text-field>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id"> – </v-container>
              <v-container tag="span" v-if="currentlyEditing !== selectedEvent.id">{{ new
            Date(selectedEvent.end)?.toDateString()
                }}</v-container>
              <v-text-field v-else v-model="selectedEvent.end" min="1970-00-00T00:00" max="2100-01-01T00:00"
                type="datetime-local" :rules="rules.basic" label="End (*)"></v-text-field>
              <v-divider></v-divider>
              <v-container v-if="currentlyEditing !== selectedEvent.id">{{ selectedEvent.eventType }}</v-container>
              <v-combobox v-else :items="names" v-model="selectedEvent.eventType" vuetifyjs="primary"
                label="Choose event type (*)" @blur="getEventType"></v-combobox>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.desc }}
              </form>
              <form v-else>
                <v-textarea v-model="selectedEvent.desc" :rules="rules.desc" type="text" rows="3"
                  placeholder="Change notification text">
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
  props: ['checkIfHasDue', 'localStorageKey'],
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    isOpenYearPicker: false,
    weekday: [1, 2, 3, 4, 5, 6, 0],
    name: null,
    desc: null,
    eventType: null,
    start: null,
    end: null,
    isStartEndErr: false,
    currentlyEditing: null,
    lastEdited: null,
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    popups: {
      popupDate: false,
      popup: false,
    },
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
    rules: {
      basic: [value => !!value || 'This field is required'],
      name: [
        value => !!value || 'Event name is required',
        value => (value && /[^ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value)) || 'Event name should not contain special characters',
      ],
      desc: [
        value => !!value || 'Event notification text is required',
        value => (value?.length <= 300) || 'Notification text should be less than 300 characters',
      ],
    }
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
    setPopupDate({ date, time }) {
      this.popups.popupDate = true
      this.setFocus(date)
      this.start = `${date} ${time || "00:00"}`
    },
    setFocus(date) {
      this.focus = date
    },
    viewDay({ date }) {
      this.setFocus(date)
      this.type = 'day'
    },
    getEventColor(event) {
      /* Corner case: user changes event type, saves, clicks the same event again.
      Yet the Calendar API is smarter and does not trigger the selectedElement activator twice
      */
      if (this.selectedEvent?.id === this.lastEdited?.id) {
        this.selectedEvent.color = this.lastEdited?.color
      }
      return event.color
    },
    closeDialog() {
      this.name = '',
        this.desc = '',
        this.eventType = '',
        this.start = '',
        this.end = '',
        this.popups = {
          popupDate: false,
          popup: false,
        }
    },
    setToday() {
      this.setFocus(this.today)
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
      const isNameValid = name?.trim()
      const isDescValid = desc && desc.length <= 300
      const isDateValid = (date) => date && typeof date === 'string'
      const isStartEndOk = new Date(start) < new Date(end)
      this.isStartEndErr = !isStartEndOk
      const isValid = isNameValid && isDescValid
        && isDateValid(start) && isDateValid(end)
        && eventType && isStartEndOk
        console.log(this.isStartEndErr)
      return isValid
    },
    parseDate(date) {
      return date.replace("T", " ")
    },
    getEventType(event) {
      this.selectedEvent.eventType = event.target.value
    },
    addEvent(event) {
      const { name, desc, start, end, eventType, callback, validate } = event
      validate()
      const isValid = this.validateFields({ name, desc, start, end, eventType })
      if (isValid) {
        const _start = this.parseDate(start)
        const _end = this.parseDate(end)

        this.events.push({
          // simplification: use the timestamp when this event was created as its id
          id: Date.now(),
          name,
          desc,
          start: _start,
          end: _end,
          eventType,
          /* simplification: each event type is paired with a colour
            user-input-ed event types default to the first colour */
          color: this.getColor(eventType),
        })
        this.setToLocalStorage()

        this.name = '',
          this.desc = '',
          this.eventType = '',
          this.start = '',
          this.end = ''

        this.popups = {
          popupDate: false,
          popup: false,
        }
        this.getEvents()
        this.checkIfHasDue()
        if (callback) callback()
        alert("Success! Event has been added.")
      }
    },
    editEvent(event) {
      this.currentlyEditing = event.id
    },
    getColor(eventType) {
      const defaultColor = "teal lighten-3"
      const colorInx = this.names.indexOf(eventType)
      return colorInx >= 0 ? this.colors[colorInx] : defaultColor
    },
    updateEvent(event) {
      const _start = this.parseDate(event.start)
      const _end = this.parseDate(event.end)
      const _color = this.getColor(event.eventType)
      const isValid = this.validateFields({ name: event.name, desc: event.desc, start: _start, end: _end, eventType: event.eventType })

      if (!isValid) return

      this.events = this.events.map(_event => _event.id !== event.id ? _event : { ...event, start: _start, end: _end, color: _color })
      this.lastEdited = { id: event.id, color: _color }
      this.setToLocalStorage()
      this.selectedOpen = false
      this.currentlyEditing = null
      this.getEvents()
      this.checkIfHasDue(true)
      this.start = null
      this.end = null
    },
    deleteEvent(event) {
      this.events = this.events.filter(_event => _event.id !== event)
      this.setToLocalStorage()
      this.selectedOpen = false
      this.getEvents()
      this.checkIfHasDue()
      this.start = null
      this.end = null
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
      /* User clicked on a date outside the current month:
      if we update the range then the preselect is lost.
      */
      const isPopupOpen = this.popups.popup || this.popups.popupDate
      this.start = isPopupOpen ? this.start : start
      this.end = end
    },
  }
}
</script>
