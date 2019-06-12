
const eventWrapper = document.querySelector(".event-wrapper");
const form = document.querySelector(".form-event");
/*const tableEvent = document.querySelector(".event-table");
const tbody = tableEvent.querySelector("tbody");*/

const dateEvent = form.querySelector(".event-name");
const eventNameInput = form.querySelector(".event-name-input");
const dateEventInput = form.querySelector(".date-event-input");
const startEventInput = form.querySelector(".start-event-input");
const endEventInput = form.querySelector(".end-event-input");
const warningField = form.querySelector(".warning");

let dataEvents = [
  {
    id: 25,
    date: "2019-06-22",
    name: 'Coffee break',
    start: "15:00",
    end: "16:30",
  },
  {
    id:56,
    date: "2019-06-22",
    name: 'Walking',
    start: "12:00",
    end: "13:00",
  },
  {
    id: 251,
    date: "2019-06-21",
    name: 'Yoga',
    start: "9:00",
    end: "11:00",
  },
  {
    id:576,
    date: "2019-06-22",
    name: 'Yoga',
    start: "9:00",
    end: "11:00",
  },
  {
    id: 24,
    date: "2019-06-21",
    name: 'Tea',
    start: "9:00",
    end: "9:20",
  },
  {
    id:59,
    date: "2019-06-20",
    name: 'Reading',
    start: "14:00",
    end: "14:30",
  },
  {
    id: 23,
    date: "2019-06-21",
    name: 'Walking',
    start: "12:00",
    end: "13:00",
  },
  {
    id:96,
    date: "2019-06-20",
    name: 'Walking',
    start: "12:00",
    end: "13:00",
  }
];

const eventSort = (a, b) => {
  if(Date.parse(a.date) < Date.parse(b.date)) {
    return -1;
  }
  if(Date.parse(a.date) >  Date.parse(b.date)) {
    return 1;
  }
  return 0;
}

dataEvents.sort(eventSort);

const getEventFullDate = (date, time) => {
  const eventDate = new Date(date);
  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const day = date.slice(-2);
  const hours = time.slice(0,2);
  const minutes = time.slice(-2);
  return new Date(year, month, day, hours, minutes,0);
}

const tdCreate = (tr, item='', $class='', dataAttr=null) => {
  const td = document.createElement("td");
  if (dataAttr) {
    td.dataset.id = dataAttr;
  }
  if (item) {
    td.textContent = item;
  } else if($class === "remove-column") {
    td.innerHTML = '<i class="fas fa-times"></i>';
    td.addEventListener("click", e => {
      const eventId = parseInt(td.dataset.id);
      const events = dataEvents.filter(item => item.id !== eventId);

      dataEvents = events;
      eventWrapper.innerHTML = '';
      dataEvents.sort(eventSort);
      allEventsRender(dataEvents);
    });
  } else if($class === "edit-column") {
    td.innerHTML = '<i class="fas fa-edit"></i>';
    td.addEventListener("click", e => {
      const eventId = parseInt(td.dataset.id);
      return;
    });
  }
  tr.appendChild(td);
};


const eventsRender = (events, tbody) => {
  const fragment = document.createDocumentFragment();
    events.forEach(event => {
      const tr = document.createElement("tr");
      tr.classList.add("event-row");
      tdCreate(tr, event.name, 'name-column', event.id);
      tdCreate(tr, null, 'date-column');
      tdCreate(tr, event.start, 'start-column');
      tdCreate(tr, event.end, 'end-column');
      tdCreate(tr, null, 'edit-column', event.id);
      tdCreate(tr, null, 'remove-column', event.id);
      fragment.appendChild(tr);
    });   
   tbody.appendChild(fragment);
  return;
};

const dateEventsRender = (events=[]) => {
  if(!events.length) {
    return;
  }
  const fragment = document.createDocumentFragment();

  const dateEventsDiv = document.createElement("div");
  dateEventsDiv.classList.add("event-items");
  fragment.appendChild(dateEventsDiv);

  const title = document.createElement("h3");
  title.classList.add("date-event");
  title.textContent = events[0].date;
  dateEventsDiv.appendChild(title);

  const table = document.createElement("table");
  table.classList.add("table", "table-borderless", "event-table");
  dateEventsDiv.appendChild(table);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  eventsRender(events, tbody);   
  eventWrapper.appendChild(fragment);
  return;
}

const allEventsRender = dataEvents => {
  let iBegin = 0, iEnd = 0;
 //debugger;
  for(let i=0; i < dataEvents.length + 1; i++) {
    if((i < dataEvents.length && dataEvents[i].date > dataEvents[iEnd].date) || i === dataEvents.length) {
      iEnd = i;
      let events = dataEvents.slice(iBegin, iEnd);
      dateEventsRender(events);
      iBegin = i;
    }
  }
}

allEventsRender(dataEvents);

form.addEventListener("submit", e => {
  e.preventDefault();
  if (
    eventNameInput.value === "" ||
    dateEventInput.value === "" ||
    startEventInput.value === "" ||
    endEventInput.value === ""
  ) {
    warningField.textContent = "There is a blank field!!! Fill it";
    return;
  }
  const newEvent = {
    id: dataEvents.length,
    name: eventNameInput.value,
    date: dateEventInput.value,
    start: startEventInput.value,
    end: endEventInput.value,
    startMillisecons: Date.parse(getEventFullDate(dateEventInput.value, startEventInput.value)),
    endMillisecons: Date.parse(getEventFullDate(dateEventInput.value, endEventInput.value)),
  };
  let isExist = false;

  dataEvents.forEach(item => {
    if(item.endMillisecons > newEvent.startMillisecons && item.startMillisecons < newEvent.endMillisecons) {
      isExist = true;
    } 
  });

  if(isExist) {
    warningField.textContent = 'This time is already reserved for another event';
    return;
  }
  dataEvents.push(newEvent);
  dataEvents.sort(eventSort);
  eventWrapper.innerHTML = '';
  allEventsRender(dataEvents);

  eventNameInput.value = "";
  dateEventInput.value = "";
  startEventInput.value = "";
  endEventInput.value = "";
  warningField.textContent = "";
});

startEventInput.addEventListener('change', e => {
  warningField.textContent = "";
  endEventInput.value = "";
  const startTime = e.target.value.slice(0, 2);
  if( parseInt(startTime) < 9) {
    warningField.textContent = "too early to start an event";
    return;
  } else {
    warningField.textContent = "";
  }
});

endEventInput.addEventListener('change', e => {
  warningField.textContent = "";
  const endTime = e.target.value.slice(0, 2);
  const endTimeMinutes = e.target.value.slice(-2);

  if( parseInt(endTime) > 18 || parseInt(endTime) < startEventInput 
        || parseInt(endTime) < 9 || (parseInt(endTime) === 18 && parseInt(endTimeMinutes) > 0))  {
    warningField.textContent = "incorrect end time";
    return;
  } else {
    warningField.textContent = "";
  }
});
