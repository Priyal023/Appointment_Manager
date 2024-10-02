const tasks = {};
function addTask() {
  const input = document.getElementById("input").value.trim();
  const dateValue = document.getElementById("dateInput").value;
  const timeValue = document.getElementById("timeInput").value;
  const taskList = document.getElementById("taskList");

  if (input === "" || dateValue === "" || timeValue === "") {
    alert("Please fill out all fields before adding the task.");
    return;
  }

  const dateTime = `${dateValue} ${timeValue}`;
  const now = new Date();
  const taskDateTime = new Date(dateTime);

  if (taskDateTime < now) {
    alert("You cannot add tasks for past dates or times.");
    return;
  }

  if (tasks[dateTime]) {
    alert(
      "A task is already scheduled for this time. Please choose a different time."
    );
    return;
  }

  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("draggable", "true");
  task.setAttribute("id", `task-${Date.now()}`);
  task.setAttribute("data-datetime", dateTime);

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");

  checkbox.onclick = function () {
    const completedContainer = document.getElementById("CompletedContainer");

    if (checkbox.checked) {
      task.style.textDecoration = "line-through";
      task.querySelector("input").checked = true;
      delete tasks[dateTime];
      completedContainer.appendChild(task);
    } else {
      task.style.textDecoration = "none";
      tasks[dateTime] = true;
      taskList.appendChild(task);
      sortTasks();
    }
  };

  const taskText = document.createElement("span");
  taskText.innerText = input;

  const dateTimeSpan = document.createElement("span");
  dateTimeSpan.innerText = ` (${dateTime})`;
  dateTimeSpan.style.fontSize = "1rem";
  dateTimeSpan.style.color = "black";

  taskText.appendChild(dateTimeSpan);
  task.appendChild(checkbox);
  task.appendChild(taskText);

  taskList.appendChild(task);

  document.getElementById("input").value = "";
  document.getElementById("timeInput").value = "";
  document.getElementById("dateInput").value = "";

  task.ondragstart = function (event) {
    event.dataTransfer.setData("text", event.target.id);
  };

  const dropzone = document.getElementById("CompletedContainer");

  dropzone.ondragover = function (event) {
    event.preventDefault();
  };

  dropzone.ondrop = function (event) {
    event.preventDefault();
    const eleId = event.dataTransfer.getData("text");
    const draggedTask = document.getElementById(eleId);
    if (draggedTask) {
      dropzone.appendChild(draggedTask);
      draggedTask.style.textDecoration = "line-through";
      draggedTask.querySelector("input").checked = true;
      delete tasks[draggedTask.getAttribute("data-datetime")];
    }
  };

  tasks[dateTime] = true;

  sortTasks();
}

function sortTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = Array.from(taskList.children);

  tasks.sort((a, b) => {
    const dateA = new Date(a.getAttribute("data-datetime"));
    const dateB = new Date(b.getAttribute("data-datetime"));
    return dateA - dateB;
  });

  taskList.innerHTML = "";
  tasks.forEach((task) => taskList.appendChild(task));
}
