
let tasks = [];
let deletedTasks = [];

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        taskList.innerHTML += `
          <li class="flex justify-between items-center p-2 border rounded-lg ${task.done ? 'bg-green-100' : ''}">
            <span class="${task.done ? 'line-through text-gray-500' : ''}">${task.text}</span>
            <div class="space-x-2">
              <button onclick="toggleDone(${index})"
                class="px-2 py-1 text-xs rounded bg-green-500 text-white hover:bg-green-600">
                ${task.done ? '&#10004;' : 'Done'}
              </button>
              <button onclick="editTask(${index})"
                class="px-2 py-1 text-xs rounded bg-yellow-500 text-white hover:bg-yellow-600">
                Edit
              </button>
              <button onclick="deleteTask(${index})"
                class="px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        `;
    });

    updateCounts();
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();

    if (text === "") return alert("Please enter a task!");

    if (/^\d+$/.test(text))  {
        return alert("Task name should not contain numbers!");
    }

    const isDuplicate = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        return alert("This task already exists!");
    }


    tasks.push({ text, done: false });
    taskInput.value = "";
    renderTasks();
}

function toggleDone(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function editTask(index) {
    const newTask = prompt("Edit task:", tasks[index].text);
    if (newTask !== null && newTask.trim() !== "") {
        tasks[index].text = newTask.trim();
        renderTasks();
    }
}

function updateCounts() {
    document.getElementById("totalCount").innerText = tasks.length;
    document.getElementById("remainingCount").innerText = tasks.filter(t => !t.done).length;
}

function deleteTask(index) {
    const removed = tasks.splice(index, 1)[0]; 
    deletedTasks.push(removed); 
    renderTasks();
}


function restoreLastDeletedTask() {
    if (deletedTasks.length === 0) {
        return alert("No task to restore!");
    }

    const restored = deletedTasks.pop(); 
    tasks.push(restored); 
    renderTasks();
}


