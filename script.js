// ─── State ────────────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ─── DOM References ───────────────────────────────────────────────────────────
const input   = document.getElementById("task-input");
const addBtn  = document.getElementById("add-btn");
const list    = document.getElementById("task-list");
const filters = document.querySelector(".filters");

// ─── Persistence ──────────────────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ─── Stats  ────────────────────────────────────────────────────────────
function updateStats() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;

  document.getElementById("count-pending").textContent   = `${pending} task${pending !== 1 ? "s" : ""} left`;
  document.getElementById("count-completed").textContent = `${completed} completed`;
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderTasks() {
  const filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending")   return !task.completed;
    return true;
  });

    if(filtered.length === 0){
        list.innerHTML = `<li class="empty-state">No tasks ${currentFilter}</li>`;
    }
    else{
  list.innerHTML = filtered.map(task => `
    <li class="task ${task.completed ? "completed" : ""}">
      <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
      <span>${task.text}</span>
      <button data-id="${task.id}">Delete</button>
    </li>
  `).join("");
}

updateStats();
}

// ─── Add Task ─────────────────────────────────────────────────────────────────
function addTask() {
  const text = input.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, completed: false });
  input.value = "";
  input.focus();
  saveTasks();
  renderTasks();
}

// ─── Enter Listeners ──────────────────────────────────────────────────────────
addBtn.addEventListener("click", addTask);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

// ─── Delete / Toggle ──────────────────────────────────────────────────────────
list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.tagName === "BUTTON") {
    tasks = tasks.filter(task => task.id !== id);
  }

  if (e.target.type === "checkbox") {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
  }

  saveTasks();
  renderTasks();
});

// ─── Filters ──────────────────────────────────────────────────────────────────
filters.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  currentFilter = e.target.dataset.filter;

  filters.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");

  renderTasks();
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderTasks();