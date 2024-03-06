# Meleton test task

## About this app
- [Nuxt.js v.2.x](https://nuxtjs.org)
- [Vuetify v.2.x](https://vuetifyjs.com/)
- SPA

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:5005
$ npm dev

# build for production and launch server
$ npm build
$ npm start

```

## Functionality

- The user can add/edit/delete an event;
- You can edit: title, text, time and type of event; the color will change automatically based on the event type binding - color;
- If the user clicks on the day, and not on the “add new event” button, then the date in the new event is entered according to the date in the calendar where the user clicked. The time is set to "00:00" if clicked in month view – or to the time the user clicked on in week/day views. These can be editted by the user;
- If the user started to create a new event - but did not save it - and closed it, then the fields are reset and the new event must be filled out again;
- For each event, the user has to set: a name, description, start and end times, they can either enter the event type manually or select it from the list;
- Each event type currently has a specific color (* simplification and room for improvement);
- When a user click on a specific day, a form pops up in a window where they are asked to create a new event for that day. Form fields are be checked for data correctness data and completion. All fields are required;
- All data is saved locally in LocalStorage;
- If there is 1 hour left before the marked event (if the application page was opened earlier) or less (e.g., say, the client opened the application 23 minutes before the event), a dialog box with a notification (notification text) and a number of -minutes remaining before the start of the event. The dialog box can be closed;
- The user can click the button next to current month in the calendar and select a different label through a popup. For e.g., they need to open the next year;
– The user can switch between the current month – past/next with an arrow at the top of the calendar;
- The "today" button returns the user to the current date.


### Event includes:
- Date and time of the event;
- Duration of the event (if the number of hours goes beyond the day, then visually the event continues for the next days);
- Event type (Birthday, Meeting, etc. The user can select from the available options or add his own option to this list);
- Notification text (up to 300 characters);
