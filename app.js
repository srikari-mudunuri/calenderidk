let calendar = null;
let currentFilter = "all";
let allItems = JSON.parse(localStorage.getItem('planner_items')) || [];

document.addEventListener('DOMContentLoaded', () => {
  setupCalendar();
  setupForm();
  setupFilterButtons();
  setupTasks();
  setupNotes();
  setupTimer();
});

// --- CALENDAR SETUP ---
function setupCalendar() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
    height: '100%',
    events: [],
    
    // Delete event on click
    eventClick: (info) => {
      if (confirm(`Delete "${info.event.title}" from your calendar?`)) {
        allItems = allItems.filter(item => item.id !== info.event.id);
        localStorage.setItem('planner_items', JSON.stringify(allItems));
        renderEvents();
      }
    }
  });

  calendar.render();
  renderEvents();
}

// --- FORM HANDLER ---
function setupForm() {
  const form = document.getElementById('item-form');
  const typeSelect = document.getElementById('entry-type');

  typeSelect.addEventListener('change', (e) => {
    const isAssignment = e.target.value === 'assignment';
    document.getElementById('datetime-fields').style.display = isAssignment ? 'block' : 'none';
    document.getElementById('date-only-fields').style.display = isAssignment ? 'none' : 'block';
    
    document.getElementById('item-datetime').required = isAssignment;
    document.getElementById('item-date').required = !isAssignment;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = typeSelect.value;
    const title = document.getElementById('item-title').value.trim();
    const start = (type === 'assignment') 
      ? document.getElementById('item-datetime').value 
      : document.getElementById('item-date').value;

    if (!start) {
      alert("Please select a date!");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      type,
      title,
      start
    };

    allItems.push(newItem);
    localStorage.setItem('planner_items', JSON.stringify(allItems));
    
    renderEvents();
    form.reset();
    document.getElementById('datetime-fields').style.display = 'block';
    document.getElementById('date-only-fields').style.display = 'none';
    document.getElementById('item-datetime').required = true;
    document.getElementById('item-date').required = false;
  });
}

// --- RENDER EVENTS & FILTERS ---
function renderEvents() {
  if (!calendar) return;

  const filtered = allItems.filter(item => currentFilter === 'all' || item.type === currentFilter);
  const calendarEvents = filtered.map(item => ({
    id: item.id,
    title: item.title,
    start: item.start,
    backgroundColor: item.type === 'ec' ? '#10b981' : item.type === 'event' ? '#ec4899' : '#0284c7'
  }));

  calendar.removeAllEvents();
  calendar.addEventSource(calendarEvents);
}

function setupFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderEvents();
    });
  });
}

// --- TO-DO LIST ---
function setupTasks() {
  let tasks = JSON.parse(localStorage.getItem('hub_tasks')) || [];
  const list = document.getElementById('task-list');

  function renderTasks() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `<span>${task}</span><button class="delete-btn">✕</button>`;
      
      div.querySelector('.delete-btn').addEventListener('click', () => {
        tasks.splice(index, 1);
        localStorage.setItem('hub_tasks', JSON.stringify(tasks));
        renderTasks();
      });
      list.appendChild(div);
    });
  }

  document.getElementById('add-task-btn').addEventListener('click', () => {
    const input = document.getElementById('task-input');
    if (!input.value.trim()) return;
    tasks.push(input.value.trim());
    localStorage.setItem('hub_tasks', JSON.stringify(tasks));
    input.value = "";
    renderTasks();
  });

  renderTasks();
}

// --- QUICK NOTES ---
function setupNotes() {
  const notesInput = document.getElementById('notes-input');
  notesInput.value = localStorage.getItem('hub_notes') || "";

  document.getElementById('save-notes-btn').addEventListener('click', () => {
    localStorage.setItem('hub_notes', notesInput.value);
    alert("Notes saved!");
  });

  const notesInputEC = document.getElementById('notes-ec-input');
  notesInputEC.value = localStorage.getItem('hub_notes_ec') || "";

  document.getElementById('save-notes-ec-btn').addEventListener('click', () => {
    localStorage.setItem('hub_notes_ec', notesInputEC.value);
    alert("Notes saved!");
  });

  const notesInputPersonal = document.getElementById('notes-personal-input');
  notesInputPersonal.value = localStorage.getItem('hub_notes_personal') || "";

  document.getElementById('save-notes-personal-btn').addEventListener('click', () => {
    localStorage.setItem('hub_notes_personal', notesInputPersonal.value);
    alert("Notes saved!");
  });
}

// --- POMODORO TIMER ---
function setupTimer() {
  let timerInterval = null;
  let timeLeft = 25 * 60;

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  document.getElementById('timer-start').addEventListener('click', () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      document.getElementById('timer-start').innerText = 'Start';
    } else {
      document.getElementById('timer-start').innerText = 'Pause';
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          timerInterval = null;
          document.getElementById('timer-start').innerText = 'Start';
          alert("Time's up! Take a break.");
        }
      }, 1000);
    }
  });

  document.getElementById('timer-add-5').addEventListener('click', () => {
    timeLeft += 5 * 60;
    updateDisplay();
  });

  document.getElementById('timer-reset').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateDisplay();
    document.getElementById('timer-start').innerText = 'Start';
  });
}