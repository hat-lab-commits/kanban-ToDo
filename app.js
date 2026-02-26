if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    console.log("通知許可:", permission);
  });
}
function sendNotification(message) {
    if (Notification.permission === "granted" && allowNotifications) {
      new Notification(message);
    }
}    
let notifiedToday = false; //今日もう通知した？
let allowNotifications = localStrage.getItem("allownotifications") === "true";
let tasks = [];

const addBtn = document.getElementById("addTaskBtn");

const modal = document.getElementById("notificationModal");

if (!localStorage.getItem("notificationAsked")) {
  modal.style.display = "flex";
}
const allowBtn = document.getElementById("allowNotification");
if (Notification.permission === "default" &&
    localStorage.getItem("allowNotifications") === null) {
  modal.style.display = "flex";
    }

const skipBtn = document.getElementById("skipNotification");

allowBtn.addEventListener("click", () => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      allowNotifications = true;
      localStorage.setItem("allowNotifications", "true");
    }
  });
  modal.style.display = "none";
});
skipBtn.addEventListener("click", () => {
  allowNotifications = false;
  localStorage.setItem("allowNotifiations", "false");
  modal.style.display = "none";
});  
console.log(document.querySelectorAll(".task-list"));

addBtn.addEventListener("click", () => {
  const input = document.getElementById("taskTitle");
  const prioritySelect = document.getElementById("taskPriority");
  const dueDateInput = document.getElementById("taskDueDate");
  const title = input.value.trim();
  const priority = prioritySelect.value;
  
  if (title === "") return;

  const newTask = {
    id: Date.now(),
    title: title,
    status: "todo",
    priority: priority,
    dueDate: dueDateInput.value,
    checked: false
  };

  tasks.push(newTask);

  input.value = "";
  dueDateInput.value = "";

  renderTasks();
});

  const notifyBtn = document.getElementById("enableNotification");

  notifyBtn.addEventListener("click", () => {
    Notification.requestPermission().then(permission => {
      console.log("通知許可:", permission);
    });
  });
  function renderTasks() {
    
    const notice = document.getElementById("noticeArea");
    notice.textContent = "";
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
        tasks = tasks.filter(t => t.id !== task.id);
        renderTasks();
      });

      div.prepend(checkbox);
      
      div.setAttribute("draggable", true);
      div.addEventListener("dragstart", (e) => {
        console.log("dragstart発火",task.id);
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

      if (task.dueDate) {
        const today = new Date();
        today.setHours(0,0,0,0);

        const due = new Date(task.dueDate + "T00:00:00");
        
        if (due < today) {
          div.style.color = "red";
        } else if (due.getTime() === today.getTime()) {
          div.style.color = "orange";
          //画面表示は毎回出す
          notice.textContent = "今日が期限のタスクがあります！";
        if (!notifiedToday) {
          notifiedToday = true; //通知した記憶
          sendNotification("今日が期限のタスクあります！！");
          }
        }
        const formatted = 
          due.getFullYear() + "年" +
          (due.getMonth() + 1) + "月" +
          due.getDate() + "日";
          
        const dateDiv = document.createElement("div");
        dateDiv.textContent = "期限: " + formatted;
        div.appendChild(dateDiv);
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

  