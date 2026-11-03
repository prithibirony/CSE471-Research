
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDeadline = document.getElementById("taskDeadline");
const taskCategory = document.getElementById("taskCategory");
const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function displayTasks() {
    taskList.innerHTML = "";

    const selectedFilter = filterTasks.value;

const filteredTasks = tasks.filter(function(task) {
    if (selectedFilter === "Pending") {
        return !task.completed;
    }

    if (selectedFilter === "Completed") {
        return task.completed;
    }

    return true;
});

filteredTasks.forEach(function(task)  {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.editing) {
            taskItem.innerHTML = `
                <input type="text" class="edit-input"
                    id="editTitle${task.id}"
                    value="${task.title.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")}">

                <input type="date" class="edit-input"
                    id="editDeadline${task.id}"
                    value="${task.deadline}">

                <select class="edit-input" id="editCategory${task.id}">
                    <option value="Assignment">Assignment</option>
                    <option value="Exam">Exam</option>
                    <option value="Project">Project</option>
                    <option value="Other">Other</option>
                </select>

                <button class="save-button">Save</button>
                <button class="cancel-button">Cancel</button>
            `;

            taskList.appendChild(taskItem);

            document.getElementById("editCategory" + task.id).value =
                task.category;

            taskItem.querySelector(".save-button").addEventListener("click", function() {
                const newTitle = document.getElementById("editTitle" + task.id).value.trim();
                const newDeadline = document.getElementById("editDeadline" + task.id).value;
                const newCategory = document.getElementById("editCategory" + task.id).value;

                if (!newTitle || !newDeadline) {
                    alert("Please enter task name and deadline.");
                    return;
                }

                task.title = newTitle;
                task.deadline = newDeadline;
                task.category = newCategory;
                task.editing = false;

                saveTasks();
                displayTasks();
            });

            taskItem.querySelector(".cancel-button").addEventListener("click", function() {
                task.editing = false;
                displayTasks();
            });

        } else {
            const title = document.createElement("h3");
            title.textContent = task.title;

            const deadline = document.createElement("p");
            deadline.textContent = "Deadline: " + task.deadline;

            const category = document.createElement("p");
            category.textContent = "Category: " + task.category;

            const status = document.createElement("p");
            status.textContent = "Status: " +
                (task.completed ? "Completed" : "Pending");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                task.editing = true;
                displayTasks();
            });

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed
                ? "Mark Pending"
                : "Mark Complete";

            completeButton.addEventListener("click", function() {
                task.completed = !task.completed;
                saveTasks();
                displayTasks();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });

                saveTasks();
                displayTasks();
            });

            taskItem.appendChild(title);
            taskItem.appendChild(deadline);
            taskItem.appendChild(category);
            taskItem.appendChild(status);
            taskItem.appendChild(editButton);
            taskItem.appendChild(completeButton);
            taskItem.appendChild(deleteButton);

            taskList.appendChild(taskItem);
        }
    });
}


// Add Task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newTask = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        deadline: taskDeadline.value,
        category: taskCategory.value,
        completed: false
    };

    if (!newTask.title) {
        alert("Please enter a task name.");
        return;
    }

    tasks.push(newTask);
    saveTasks();
    displayTasks();

    alert("Task added successfully!");
    taskForm.reset();
});

displayTasks();

filterTasks.addEventListener("change", function() {
    displayTasks();
});
