document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskTimer = document.getElementById("task-timer");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const themeToggle = document.querySelector(".theme-toggle");
    const alarm = document.getElementById("alarm");

    // Request notification permission
    if (Notification.permission !== "denied") {
        Notification.requestPermission();
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.forEach(task => addTask(task.text, task.timer, task.completed));
    }

    loadTasks();

    function addTask(text, minutes, completed = false) {
        if (text.trim() === "") return;

        const li = document.createElement("li");
        li.innerHTML = `
            <span class="task-text">${text}</span>
            <span class="timer">${minutes ? minutes + ":00" : ""}</span>
            <button class="delete">X</button>
        `;

        if (completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", () => {
            li.classList.toggle("completed");
            saveTasks();
        });

        li.querySelector(".delete").addEventListener("click", (e) => {
            e.stopPropagation();
            li.remove();
            saveTasks();
        });

        if (minutes) {
            startTimer(li, minutes);
        }

        taskList.appendChild(li);
        taskInput.value = "";
        taskTimer.value = "";
        saveTasks();
    }

    function startTimer(taskElement, minutes) {
        let timeLeft = minutes * 60;
        let timerDisplay = taskElement.querySelector(".timer");

        const timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's up!";
                alarm.play();
                sendNotification("Reminder", `Time's up for task: ${taskElement.querySelector(".task-text").innerText}`);
                return;
            }

            let min = Math.floor(timeLeft / 60);
            let sec = timeLeft % 60;
            timerDisplay.textContent = `${min}:${sec < 10 ? "0" + sec : sec}`;
            timeLeft--;
        }, 1000);
    }

    function sendNotification(title, message) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach(task => {
            tasks.push({
                text: task.querySelector(".task-text").innerText,
                timer: task.querySelector(".timer").textContent.replace(":00", ""),
                completed: task.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskButton.addEventListener("click", () => addTask(taskInput.value, taskTimer.value));
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addTask(taskInput.value, taskTimer.value);
    });

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀" : "🌙";
    });
});