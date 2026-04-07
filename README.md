# taskMate
# 📝 TaskMate — Vanilla JS Task Manager

A simple yet powerful task management web application built using **pure JavaScript (no frameworks)**.
This project demonstrates core frontend engineering concepts like **state management, DOM manipulation, event handling, and persistent storage**.

---

## 🚀 Features

* ➕ Add new tasks
* ❌ Delete tasks
* ✅ Mark tasks as completed
* 🔄 Toggle task status (complete ↔ pending)
* 🔍 Filter tasks:

  * All
  * Completed
  * Pending
* 💾 Persistent storage using **localStorage**
* 🎯 Active filter highlighting
* ⚡ Instant UI updates (state-driven rendering)

---

## 🧠 Core Concepts Demonstrated

This project is not just a UI — it's built around **core JavaScript logic**:

* State-driven UI updates
* Event delegation
* Array methods (`map`, `filter`, `forEach`)
* DOM creation & manipulation
* Data persistence using `localStorage`
* Separation of concerns (state vs UI)

---

## 🏗️ Project Structure

```plaintext
taskmate/
│
├── index.html      # Structure of the app
├── style.css       # Styling
├── script.js       # Core logic
└── README.md       # Documentation
```

---

## ⚙️ How It Works

### 🧩 1. State (Single Source of Truth)

```js
tasks = [
  { id, text, completed }
]
```

* All data is stored in the `tasks` array
* UI is always generated from this state

---

### 🔁 2. Rendering Flow

```plaintext
State (tasks array)
        ↓
renderTasks()
        ↓
DOM updated
```

---

### 🎮 3. Event Flow

```plaintext
User Action (click/type)
        ↓
Event Listener
        ↓
Update State
        ↓
Re-render UI
```

---

## 🔄 Application Workflow

```plaintext
[ User Input ]
       ↓
[ Add Task Button Click ]
       ↓
[ Update tasks array ]
       ↓
[ Save to localStorage ]
       ↓
[ renderTasks() ]
       ↓
[ UI Updated ]
```

---

## 🔍 Filtering Logic

```plaintext
tasks array
     ↓
Apply filter (all / completed / pending)
     ↓
filteredTasks
     ↓
renderTasks()
```

---

## 📦 Data Persistence (localStorage)

### Saving Data

```js
localStorage.setItem("tasks", JSON.stringify(tasks));
```

### Loading Data

```js
tasks = JSON.parse(localStorage.getItem("tasks")) || [];
```

---

## 🧠 Key Learnings

* UI should **reflect data**, not control it
* Always maintain a **single source of truth**
* Avoid direct DOM manipulation — prefer re-rendering
* Use **event delegation** for dynamic elements
* Think in terms of **state → logic → UI**

---

## 🎯 Example Task Object

```js
{
  id: 17123456789,
  text: "Learn JavaScript",
  completed: false
}
```

---

## 📊 Internal Architecture

```plaintext
            ┌───────────────┐
            │   User Input  │
            └──────┬────────┘
                   ↓
            ┌───────────────┐
            │   Event       │
            │   Handler     │
            └──────┬────────┘
                   ↓
            ┌───────────────┐
            │   Update      │
            │   State       │
            └──────┬────────┘
                   ↓
            ┌───────────────┐
            │ renderTasks() │
            └──────┬────────┘
                   ↓
            ┌───────────────┐
            │     DOM       │
            │   Updated     │
            └───────────────┘
```

---

## 🧪 How to Run

1. Clone the repository:

```bash
git clone https://github.com/yourusername/taskmate.git
```

2. Open `index.html` in your browser

---

## 📈 Future Improvements

* ✏️ Edit task functionality
* 📅 Add due dates
* 🔔 Notifications
* 📱 Responsive design improvements
* 🌙 Dark mode

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🙌 Acknowledgment

Built as part of learning **core JavaScript fundamentals** and transitioning from beginner to practical frontend development.

---

## 💡 Final Thought

> This project focuses on understanding *how things work under the hood*, rather than relying on frameworks.

---

⭐ If you found this useful, feel free to star the repo!
