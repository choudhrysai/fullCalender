/* eslint-disable no-undef */
import { LightningElement, api } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import FullCalendarScript from "@salesforce/resourceUrl/FullCalender";

export default class FullCalendarJs extends LightningElement {
  //Private
  scriptInitialized = false;
  calendar;
  @api isLoaded = false;
  eventList = [];
  renderedCallback() {
    this.isLoaded = false;
    if (this.scriptInitialized) {
      this.isLoaded = true;
      return;
    }
    this.scriptInitialized = true;
    Promise.all([
      // First step: load FullCalendar core
      loadStyle(this, FullCalendarScript + "/core/main.css"),
      loadStyle(this, FullCalendarScript + "/daygrid/main.css"),
      loadStyle(this, FullCalendarScript + "/timegrid/main.css"),
      loadStyle(this, FullCalendarScript + "/list/main.css"),
      loadScript(this, FullCalendarScript + "/core/main.js")
    ]).then(() => {
      // Second step: Load the plugins in a new promise
      Promise.all([
        loadScript(this, FullCalendarScript + "/interaction/main.js"),
        loadScript(this, FullCalendarScript + "/daygrid/main.js"),
        loadScript(this, FullCalendarScript + "/timegrid/main.js"),
        loadScript(this, FullCalendarScript + "/list/main.js")
      ]).then(() => {
        // Third step: calls your calendar builder once the plugins have been also loaded
        this.initialiseFullCalendarJs();
      });
    }).catch((error) => {
      // Catch any error while loading the scripts here
      console.error({
        message: 'Error occured on ',
        error
      });
    });
  }

  /**
   * @description Initialise the calendar configuration
   *              This is where we configure the available options for the calendar.
   *              This is also where we load the Events data.
   */
  initialiseFullCalendarJs() {
    console.log("begin");

    const calendarEl = this.template.querySelector('div.calendar');

    console.log("After Q selector");

    this.calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
      height: 'parent',
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      defaultView: 'dayGridMonth',
      defaultDate: '2020-03-23',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true,
      draggable: true,
      droppable: true, // allow "more" link when too many events
      eventDrop: info => {
        console.log("eventDrop", info);
      },
      events: [
        {
          title: 'All Day Event',
          start: '2020-02-01',
        },
        {
          title: 'Long Event',
          start: '2020-02-07',
          end: '2020-02-10'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2020-02-09T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2020-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2020-02-11',
          end: '2020-02-13'
        },
        {
          title: 'Meeting',
          start: '2020-02-12T10:30:00',
          end: '2020-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2020-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2020-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2020-02-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2020-02-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2020-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-02-28'
        }
      ]
    });
    console.log("After config");
    this.calendar.render();
    this.isLoaded = true;
  }
}
