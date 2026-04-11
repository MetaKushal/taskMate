# 📋 To-Do List App

Check out my app [here](https://metakushal.github.io/taskMate/)

> A clean, lightweight task manager built with **vanilla HTML, CSS, and JavaScript**. No frameworks, no dependencies — just the fundamentals done well, wrapped in a modern Glassmorphism UI.

-----

## Table of Contents

  - [Features](https://www.google.com/search?q=%23features)
  - [File Structure](https://www.google.com/search?q=%23file-structure)
  - [How to Run](https://www.google.com/search?q=%23how-to-run)
  - [Data Model](https://www.google.com/search?q=%23data-model)
  - [Core Functions](https://www.google.com/search?q=%23core-functions)
  - [Event Listeners](https://www.google.com/search?q=%23event-listeners)
  - [Event Delegation](https://www.google.com/search?q=%23event-delegation)
  - [localStorage](https://www.google.com/search?q=%23localstorage)
  - [JS Concepts Used](https://www.google.com/search?q=%23js-concepts-used)
  - [Roadmap](https://www.google.com/search?q=%23roadmap)

-----

## Features

| Feature | Description |
|---|---|
| ✅ Add tasks | Type and press `Enter` or click Add. The button disables when input is empty. |
| ☑️ Complete tasks | Custom circular checkboxes toggle done state. |
| ✏️ Edit tasks | Double-click any task text to edit inline. Press `Enter` to save, `Escape` to cancel. |
| ✋ Drag & Drop | Click and hold a task to reorder the list visually. |
| 🗑️ Delete tasks | Remove individual tasks after a browser confirmation prompt. |
| 🧹 Clear completed | One-click button to sweep away all finished tasks. |
| 🔍 Filter tasks | View All, Completed, or Pending separately. Your choice is remembered on refresh. |
| 📊 Live stats | Tasks left and completed count update in real time. |
| 💾 Persistence | Tasks, filter choice, and theme survive page refresh via `localStorage`. |
| 🌙 Dark mode | Deep mesh gradient dark mode, toggled and saved to `localStorage`. |
| 🪟 Modern UI | Frosted Glassmorphism design, smooth fade-in/slide-out animations, and premium typography. |
| 📭 Smart empty states | Dynamic, contextual messages depending on your current filter and task count. |

-----

## File Structure

```
todo/
├── index.html     ← structure and skeleton
├── style.css      ← all visual styling (Glassmorphism + Animations)
└── script.js      ← all logic, Drag & Drop, and behaviour
```

No build step. No `node_modules`. Open and it works.

-----

## How to Run

**Option 1 — Just open the file:**
Double-click `index.html`

**Option 2 — VS Code Live Server:**
Right-click `index.html` → Open with Live Server

**Option 3 — Node static server:**
`npx serve .`

-----

## Data Model

The entire app lives in one array called `tasks`. Every task is an object with exactly three properties:

```javascript
{
  id: 1712580293847,   // unique number from Date.now()
  text: "Buy milk",    // what the user typed
  completed: false     // has it been checked off?
}
```

The full state is just an array of these objects. Reordering items via Drag & Drop updates the actual index order of this array before saving to `localStorage`.

-----

## Core Functions

Every piece of behaviour lives in one of these core functions.

| Function | Does what | Calls |
|---|---|---|
| `addTask()` | Reads input, validates, pushes to array, clears input, disables button | `saveTasks()`, `renderTasks()` |
| `renderTasks()` | Filters array, rebuilds list HTML, triggers active states | `updateStats()` |
| `updateStats()` | Counts tasks and completed items, updates the DOM spans | — |
| `saveTasks()` | Serialises the array and writes it to localStorage | — |
| `getDragAfterElement()` | Calculates precise Y-axis mouse position to find valid drop zones | — |

**The call chain — every user action eventually triggers this:**

User Action → modify tasks array → `saveTasks()` → `renderTasks()` → `updateStats()`

-----

## Event Listeners

The app utilizes strategic event listeners to handle complex interactions efficiently.

| Attached to | Event | What it does |
|---|---|---|
| `input` | `input` | Checks if text exists to enable/disable the Add button |
| `addBtn` / `input` | `click` / `keydown` | Calls `addTask()` |
| `list` | `click` | Handles delete (with confirmation) and checkbox toggle |
| `list` | `dblclick` | Replaces static span with an editable `<input>` field |
| `list` | `dragstart` / `dragend` | Applies visual styles for moving tasks and saves new order |
| `list` | `dragover` / `drop` | Calculates drop zones and physically moves DOM elements |
| `.filters` | `click` | Updates `currentFilter`, saves to `localStorage`, re-renders |
| `#clear-completed` | `click` | Filters out completed tasks and updates state |
| `#theme-toggle` | `click` | Flips dark mode class, changes icon, saves to `localStorage` |

-----

## Event Delegation

Instead of attaching a listener to every task's button, checkbox, and text span — which would break every time `renderTasks()` wipes and rebuilds the HTML — **one listener sits on the parent `<ul>`**.

When you click anything inside the list, the event *bubbles up* through the DOM until it reaches the `<ul>`, where the listener catches it. We then inspect `e.target` to figure out exactly what was clicked.

```javascript
// ONE listener handles ALL tasks — past, present, and future
list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.tagName === "BUTTON") {
    // delete this task
  }

  if (e.target.type === "checkbox") {
    // toggle this task
  }
});
```

-----

## localStorage

`localStorage` is the browser's built-in key-value store. Data survives page refreshes but is cleared when the user clears browser data. The app utilizes three keys:

| Key | Value | When saved |
|---|---|---|
| `tasks` | JSON string of the full tasks array | Every add, edit, delete, reorder, or toggle |
| `todo-filter` | `"all"`, `"completed"`, or `"pending"` | Every time a filter button is clicked |
| `theme` | `"dark"` or `"light"` | Every dark mode toggle |

`localStorage` can only store strings. `JSON.stringify` converts the array to a string for saving. `JSON.parse` converts it back to a real array when loading.

-----

## JS Concepts Used

  * **Spread operator:** Creating new object references for immutable updates (`{ ...task, completed: !task.completed }`).
  * **Array Methods:** Extensive use of `.map()`, `.filter()`, `.reduce()`, and `.some()` for data manipulation.
  * **Guard clauses:** Early returns to keep functions flat and readable (`if (!text) return;`).
  * **DOM Manipulation:** Creating elements on the fly (`document.createElement`), replacing nodes (`replaceWith`), and managing classes (`classList.add/remove/toggle`).
  * **Timeouts:** Utilizing `setTimeout` with a 0ms/10ms delay to allow browser painting (crucial for smooth drag-and-drop and input focus).
  * **HTML5 Drag and Drop API:** Managing `dragstart`, `dragover`, `dragenter`, and `dragend` events, calculating bounding client rectangles to determine drop positions.
  * **Cache Busting:** Using query strings (`?v=2.0`) in the HTML file links to force browsers to download fresh CSS/JS updates.

-----

## Roadmap

### Done ✅

  - Add / Delete / Toggle tasks
  - Filter — All / Completed / Pending
  - Smart empty state messages
  - Live stats — tasks left + completed count
  - Enter key support + auto-focus after adding
  - Prevent empty input (Add button disabled state)
  - Dark mode with localStorage persistence
  - Edit task on double-click — inline editing, swap span for input, Escape to cancel
  - Confirm before delete — `confirm()` dialog
  - Clear all completed — one-click button
  - Fade-in/Slide-out animations — CSS `@keyframes` and transitions
  - Drag to reorder — HTML5 drag-and-drop API with `localStorage` array rebuilding
  - Glassmorphism UI — Backdrop filters, radial gradients, custom checkboxes

### Future 🟡

  - Due dates — date property per task, highlight overdue
  - Categories / tags — group tasks with colour-coded labels
  - Export to JSON — download your tasks as a file
