// ─── State ─────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ─── DOM ───────────────────────────────────────────────────────────────
const input   = document.getElementById("task-input");
const addBtn  = document.getElementById("add-btn");
const list    = document.getElementById("task-list");
const filters = document.querySelector(".filters");

// ─── Persistence ───────────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ─── Stats ─────────────────────────────────────────────────────────────
function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  document.getElementById("count-pending").textContent   =
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

  if (filtered.length === 0) {
    list.innerHTML = `<li class="empty-state">No tasks ${currentFilter}</li>`;
  } else {
    list.innerHTML = filtered.map(task => `
      <li class="task ${task.completed ? "completed" : ""}" data-id="${task.id}">
        <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span>${task.text}</span>
        <button data-id="${task.id}">Delete</button>
      </li>
    `).join("");
  }

  updateStats();
}

// ─── Add Task ──────────────────────────────────────────────────────────
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

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ─── Delete + Toggle (FIXED) ───────────────────────────────────────────
list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  let hasChanged = false;

  // delete
  if (e.target.tagName === "BUTTON") {
    tasks = tasks.filter(task => task.id !== id);
    hasChanged = true;
  }

  // toggle
  if (e.target.type === "checkbox") {
    tasks = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
    hasChanged = true;
  }

  // Only re-render if a destructive action was taken
  if (hasChanged) {
    saveTasks();
    renderTasks();
  }
});

// ─── Edit Task (Double Click) ──────────────────────────────────────────
list.addEventListener("dblclick", (e) => {
  // 1. Find the closest list item so we can click anywhere on the row
  const li = e.target.closest("li.task");
  if (!li) return;

  // Ignore double clicks on the delete button or checkbox
  if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return;

  // Grab the span and the text
  const span = li.querySelector("span");
  const id = Number(li.dataset.id);
  const oldText = span.textContent;

  // Create input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = oldText;

  // Replace span with input
  span.replaceWith(editInput);

  // 2. Use setTimeout to wait for the browser's double-click text selection 
  // to finish before focusing. This prevents the "instant blur" bug.
  setTimeout(() => {
    editInput.focus();
    editInput.select(); // Bonus: Highlights the text so you can start typing!
  }, 10);

  function saveEdit() {
    const newText = editInput.value.trim();

    // If there's valid text, update it
    if (newText) {
      tasks = tasks.map(task =>
        task.id === id ? { ...task, text: newText } : task
      );
      saveTasks();
    }
    
    // Always re-render to turn the input back into a span
    renderTasks(); 
  }

  // enter = save, escape = cancel
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") renderTasks(); // Bonus: Hit escape to cancel editing
  });

  // blur = save (clicking away from the input)
  editInput.addEventListener("blur", saveEdit);
});

// ─── Init ──────────────────────────────────────────────────────────────
renderTasks();