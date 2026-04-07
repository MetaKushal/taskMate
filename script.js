// let tasks = [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');


//ts a callback
// addBtn.addEventListener("click", () => {
//     let text = input.value;

//     tasks.push({
//         id: Date.now(),
//         text: text,
//         completed: false
//     });
//     input.value = "";
//     renderTasks();
// });

//reder tasks
function renderTasks() {
    list.innerHTML = ""; //clear old ui
    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(task => {
        let li = document.createElement('li');
        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
         <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
         <span>${task.text}</span>
         <button data-id="${task.id}">Delete</button>
        `;

        list.appendChild(li);
    });
}

//delete tasks
list.addEventListener("click", (e) => {
    let id = Number(e.target.dataset.id);

    //delete
    if (e.target.tagName === "BUTTON") {
        tasks=tasks.filter(task => task.id !== id);
    }

    //toggle complete
    if(e.target.type === "checkbox"){
        tasks=tasks.map(task=>{
            if (task.id === id){
                task.completed=!task.completed;
            }
            return task;
        });
    }
    renderTasks();
});

//change colour of the active or selected button or option
document.querySelector(".filters").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        //update filter state
        currentFilter = e.target.dataset.filter;

        //remove active from all buttons
        document.querySelectorAll(".filters button").forEach(btn => {
            btn.classList.remove("active");
        });

        //add active to cliked btn
        e.target.classList.add("active");
        renderTasks();
    }
});


//LOCAL STORAGE
//add task
addBtn.addEventListener("click", () => {
    let text = input.value;
tasks.push({
    id: Date.now(),
    text:text,
    completed:false
});
localStorage.setItem("tasks", JSON.stringify(tasks));
renderTasks();
});

//delete task, tracking del button here, uf clicked then we can del from localsto too
if(e.target.tagName === "BUTTON"){
tasks=tasks.filter(task => task.id !== id);
localStorage.setItem("tasks", JSON.stringify(tasks));
}
// renderTasks();

//toggle complete
if(e.target.type === "checkbox"){
tasks= tasks.map(task=>{
    if (task.id === id){
        task.completed=!task.completed;
    }
    return task;
});
localStorage.setItem("tasks", JSON.stringify(tasks));
}
renderTasks();