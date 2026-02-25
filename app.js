let tasks = [];

const addBtn = document.getElementById("addTaskBtn");

addBtn.addEventListener("click", () => {
  const input = document.getElementById("taskTitle");
  const prioritySelect = document.getElementById("taskPriority");

  const title = input.value.trim();
  const priority = prioritySelect.value;
  
  if (title === "") return;

  const newTask = {
    id: Date.now(),
    title: title,
    status: "todo",
    priority: priority,
    checked: false
  };

  tasks.push(newTask);

  input.value = "";

  renderTasks();
});

  function renderTasks() {

    document.getElementById("todoList").innerHTML = "";
    document.getElementById("doingList").innerHTML = "";
    document.getElementById("doneList").innerHTML = "";

    tasks.forEach(task => {

      const div = document.createElement("div");
      div.textContent = task.title;
      div.classList.add("task");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.checked;

      checkbox.addEventListener("change", () => {
        task.checked = checkbox.checked;
        renderTasks();
      });

      div.prepend(checkbox);
      
      div.draggable = true;
      div.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
      });

      if (task.status === "todo") {
        document.getElementById("todoList").appendChild(div);
      }
      if (task.status === "doing") {
        document.getElementById("doingList").appendChild(div);
      }
      if (task.status === "done") {
        document.getElementById("doneList").appendChild(div); 
      }

      if (task.priority === "high") {
        div.style.borderLeft = "6px solid red";
      }
      if (task.priority === "medium") {
        div.style.borderLeft = "6px solid orange";
      }
      if (task.priority === "low") {
        div.style.borderLeft = "6px solid green";
      }

      if (task.checked) {
        div.style.textDecoration = "line-through";
        div.style.opacity = "0.6";
      }
    });

  }
    const columns = document.querySelectorAll(".task-list");
    columns.forEach(column => {

    column.addEventListener("dragover", (e) => {
      console.log("dragover動いてる", column.id);
      e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
      e.preventDefault();
  
      const taskId = Number(e.dataTransfer.getData("text/plain"));

      const task = tasks.find(t => t.id === taskId);

      if (column.id === "todoList") {
        task.status = "todo";
      }
      if (column.id === "doingList") {
        task.status = "doing";
      }
      if (column.id === "doneList") {
        task.status = "done";
      }

      renderTasks();

      console.log("dropされたよ",column.id);
    });
  });

  