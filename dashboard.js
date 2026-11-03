
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDeadline = document.getElementById("taskDeadline");
const taskCategory = document.getElementById("taskCategory");

const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");
const upcomingTasks = document.getElementById("upcomingTasks");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

// Load saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Summary Cards
function updateSummary() {
    totalTasks.textContent = tasks.length;

    pendingTasks.textContent = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    completedTasks.textContent = tasks.filter(function(task) {
        return task.completed;
    }).length;
}

// Display Upcoming Deadlines
function displayUpcomingTasks() {
    upcomingTasks.innerHTML = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = tasks
        .filter(function(task) {
            const deadline = new Date(task.deadline + "T00:00:00");
            return !task.completed && deadline >= today;
        })
        .sort(function(a, b) {
            return a.deadline.localeCompare(b.deadline);
        })
        .slice(0, 5);

    if (upcoming.length === 0) {
        upcomingTasks.textContent = "No upcoming deadlines.";
        return;
    }

    upcoming.forEach(function(task) {
        const item = document.createElement("div");
        item.className = "upcoming-item";

        const name = document.createElement("strong");
        name.textContent = task.title;

        const date = document.createElement("p");
        date.textContent = "Deadline: " + task.deadline;

        item.appendChild(name);
        item.appendChild(date);
        upcomingTasks.appendChild(item);
    });
}

// Display All Tasks

function displayTasks() {
    taskList.innerHTML = "";

    const selectedFilter = filterTasks.value;

    const filteredTasks = tasks.filter(function(task) {
        if (selectedFilter === "Pending") return !task.completed;
        if (selectedFilter === "Completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.textContent = "No tasks found.";
        return;
    }

    filteredTasks.forEach(function(task) {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.editing) {
            const titleInput = document.createElement("input");
            titleInput.className = "edit-input";
            titleInput.value = task.title;

            const deadlineInput = document.createElement("input");
            deadlineInput.type = "date";
            deadlineInput.className = "edit-input";
            deadlineInput.value = task.deadline;

            const categoryInput = document.createElement("select");
            categoryInput.className = "edit-input";

            ["Assignment", "Exam", "Project", "Other"].forEach(function(category) {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryInput.appendChild(option);
            });

            categoryInput.value = task.category;

            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.className = "save-button";

            saveButton.addEventListener("click", function() {
                if (!titleInput.value.trim() || !deadlineInput.value) {
                    alert("Please enter task name and deadline.");
                    return;
                }

                task.title = titleInput.value.trim();
                task.deadline = deadlineInput.value;
                task.category = categoryInput.value;
                task.editing = false;

                saveTasks();
                displayAll();
            });

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.className = "cancel-button";

            cancelButton.addEventListener("click", function() {
                task.editing = false;
                displayTasks();
            });

            taskItem.appendChild(titleInput);
            taskItem.appendChild(deadlineInput);
            taskItem.appendChild(categoryInput);
            taskItem.appendChild(saveButton);
            taskItem.appendChild(cancelButton);

        } else {
            const title = document.createElement("h3");
            title.textContent = task.title;

            const deadline = document.createElement("p");
            deadline.textContent = "Deadline: " + task.deadline;

            const category = document.createElement("p");
            category.textContent = "Category: " + task.category;

            const status = document.createElement("p");
            status.textContent = "Status: " + (task.completed ? "Completed" : "Pending");

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                task.editing = true;
                displayTasks();
            });

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Mark Pending" : "Mark Complete";

            completeButton.addEventListener("click", function() {
                task.completed = !task.completed;
                saveTasks();
                displayAll();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });

                saveTasks();
                displayAll();
            });

            taskItem.appendChild(title);
            taskItem.appendChild(deadline);
            taskItem.appendChild(category);
            taskItem.appendChild(status);
            taskItem.appendChild(editButton);
            taskItem.appendChild(completeButton);
            taskItem.appendChild(deleteButton);
        }

        taskList.appendChild(taskItem);
    });
}


// Refresh Dashboard
function displayAll() {
    updateSummary();
    displayUpcomingTasks();
    displayTasks();
}

// Add New Task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const newTask = {
        id: Date.now(),
        title: taskTitle.value.trim(),
        deadline: taskDeadline.value,
        category: taskCategory.value,
        completed: false
    };

    if (!newTask.title || !newTask.deadline) {
        alert("Please enter task name and deadline.");
        return;
    }

    tasks.push(newTask);

    saveTasks();
    displayAll();

    taskForm.reset();

    alert("Task added successfully!");
});

// Filter Tasks
filterTasks.addEventListener("change", function() {
    displayTasks();
});

// Initial Dashboard Load
displayAll();
