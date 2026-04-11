// ─── State ─────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// 🚀 PHASE 2: Load the saved filter, or default to "all"
let currentFilter = localStorage.getItem("todo-filter") || "all";

// ─── DOM ───────────────────────────────────────────────────────────────
const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("task-list");
const filters = document.querySelector(".filters");
const clearBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");

// ─── Persistence ───────────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ─── Stats ─────────────────────────────────────────────────────────────
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  document.getElementById("count-pending").textContent =
    `${pending} task${pending !== 1 ? "s" : ""} left`;

  document.getElementById("count-completed").textContent =
    `${completed} completed`;
}

// ─── Render ────────────────────────────────────────────────────────────
function renderTasks() {
  const filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  // 🚀 PHASE 3: Smart Empty States
  if (filtered.length === 0) {
    let emptyMessage = "No tasks found.";

    if (tasks.length === 0) {
      emptyMessage = "No tasks yet. Add one above! ✨";
    } else if (currentFilter === "pending") {
      emptyMessage = "All caught up! 🎉";
    } else if (currentFilter === "completed") {
      emptyMessage = "No completed tasks yet. Get to work! 🔥";
    }

    list.innerHTML = `<li class="empty-state">${emptyMessage}</li>`;
  } else {
    list.innerHTML = filtered.map(task => `
      <li class="task ${task.completed ? "completed" : ""}" data-id="${task.id}" draggable = "true">
        <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button data-id="${task.id}">Delete</button>
      </li>
    `).join("");
  }

  // 🚀 PHASE 2: Ensure the correct filter button is visually active on load/render
  filters.querySelectorAll("button").forEach(btn => {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  updateStats();
}

// ─── Add Task ──────────────────────────────────────────────────────────
addBtn.disabled = true;

input.addEventListener("input", () => {
  addBtn.disabled = input.value.trim() === "";
});

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = "";
  input.focus();
  addBtn.disabled = true;

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ─── Delete + Toggle ───────────────────────────────────────────────────
list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  // delete
  if (e.target.tagName === "BUTTON") {
    if (confirm("Are you sure you want to delete this task?")) {
      // 🚀 PHASE 2: Find the row and trigger the fade-out CSS animation
      const li = e.target.closest("li");
      li.classList.add("fade-out");

      // Wait 250ms for the animation to finish before actually removing it
      setTimeout(() => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
      }, 250);
    }
  }

  // toggle
  if (e.target.type === "checkbox") {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
    saveTasks();
    renderTasks();
  }
});

// ─── Edit Task (Double Click) ──────────────────────────────────────────
list.addEventListener("dblclick", (e) => {
  const li = e.target.closest("li.task");
  if (!li) return;

  if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;

  const span = li.querySelector("span");
  const id = Number(li.dataset.id);
  const oldText = span.textContent;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = oldText;

  span.replaceWith(editInput);

  setTimeout(() => {
    editInput.focus();
    editInput.select();
  }, 10);

  function saveEdit() {
    const newText = editInput.value.trim();

    if (newText) {
      tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      );
      saveTasks();
    }

    renderTasks();
  }

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTasks();
  });

  editInput.addEventListener("blur", saveEdit);
});

// ─── Clear Completed ───────────────────────────────────────────────────
clearBtn.addEventListener("click", () => {
  const hasCompletedTasks = tasks.some(task => task.completed);
  if (!hasCompletedTasks) return;

  if (confirm("Are you sure you want to remove all completed tasks?")) {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
  }
});

// ─── Filters ───────────────────────────────────────────────────────────
filters.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  currentFilter = e.target.dataset.filter;

  // 🚀 PHASE 2: Save the filter choice so it remembers on refresh
  localStorage.setItem("todo-filter", currentFilter);

  renderTasks();
});

// 🚀 PHASE 3: Dark Mode Logic ───────────────────────────────────────────
// 1. Check local storage on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

// 2. Listen for clicks to toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  // Update button icon
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  // Save preference
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

//Drag and Drop logic ──────────────────────────────────────────────────────────────
let draggedItem = null;

//wehen we start dragging
list.addEventListener("dragstart", (e) => {
  const li = e.target.closest("li.task");
  if (!li) return;

  draggedItem = li;
  setTimeout(() => li.classList.add("dragging"), 0);
});

//when drop, let go
list.addEventListener("dragend", (e) => {
  const li = e.target.closest("li.task");
  if (!li) return;

  li.classList.remove("dragging");
  draggedItem = null;

  //saving the nrw order
  const newOrderIds = [...list.querySelectorAll(".task")].map(item => Number(item.dataset.id));

  //rebuild task array, from the new order
  tasks = newOrderIds.map(id => tasks.find(t => t.id === id));
  saveTasks();
});

//while dragging overother items
list.addEventListener("dragover", (e) => {
  e.preventDefault();

  const afterElemet = getDragAfterElement(list, e.clientY);
  const draggable = document.querySelector(".dragging");

  if (!draggable) return;
  if (afterElemet == null) {
    list.appendChild(draggable);
  } else {
    list.insertBefore(draggable, afterElemet);
  }
});

//helper func, calcs exact utem hovering over
function getDragAfterElemet(container, y) {
  //group all tasks that are not being dragged
  const draggableElements = [...container.querySelectorAll(".task:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    //if the mouse is above the middle of this box, that'll be our closest target
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}


// ─── Init ──────────────────────────────────────────────────────────────
renderTasks();