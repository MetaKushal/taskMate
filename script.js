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
  <li class="task ${task.completed ? "completed" : ""}" data-id="${task.id}">
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

  // 🛑 Ignore clicks if editing is happening
  if (e.target.tagName === "INPUT" && e.target.type === "text") return;
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

// ─── edit feature ──────────────────────────────────────────────────────────────────
list.addEventListener("dblclick", (e) => {
  console.log("dblclick", e.target);

    // 1. Only trigger when span is double-clicked
    if (e.target.tagName !== "span") return;
    console.log(e.target.tagName);

    const li = e.target.closest("li");
    const id = Number(li.dataset.id);
    const oldText = e.target.textContent;

    // 2. Create input
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = oldText;

    // 3. Replace span with input
    e.target.replaceWith(editInput);
    editInput.focus();

    // 🛑 prevent click events from interfering
    editInput.addEventListener("click", (e) => e.stopPropagation());

    // 4. Define update function
    function updateTask() {
        const newText = editInput.value.trim();

        // If empty → just re-render (cancel edit)
        if (!newText) {
            renderTasks();
            return;
        }

        // 5. Update state
        tasks = tasks.map(task =>
            task.id === id ? { ...task, text: newText } : task
        );

        // 6. Save + re-render
        saveTasks();
        renderTasks();
    }

    // 7. Save on Enter
    editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") updateTask();
    });

    // 8. Save on blur
    editInput.addEventListener("blur", updateTask);
});

// ─── Init ─────────────────────────────────────────────────────────────────────
renderTasks();