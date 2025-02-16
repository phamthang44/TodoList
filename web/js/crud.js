//mục tiêu là viết 1 hàm có thể dùng cho việc render dữ liệu ra giao diện co nhiều trang dạng table và có form trong đó ví dụ
//add
//còn delete thì ko cần ở đây hoặc có thể thì phải làm cho nó ask before confirming
// ngoài task ra thì còn 1 trang nữa dùng crud là todolist quản lí todolist đó là dashboard

function CrudTasks(options) {
  let form = document.querySelector(options.formSelector);
  let container = document.querySelector(options.renderArea);
  let submitter = document.querySelector(options.formSubmitter);
  let contextPath = options.contextPath || "";
  let todolist = getTaskInfo();
  let tasks = getTasksFromLocalStorage(); // Lưu danh sách task tạm thời trên client
  // 📝 Lấy dữ liệu từ form dưới dạng object

  function getFormDataObject(form, submitter) {
    let formData = new FormData(form, submitter);
    console.log(formData.get("title").innerText);

    const info = getTaskInfo();

    const obj = {
      title: safeAlert(formData.get("title")) || "No Title",
      description: safeAlert(formData.get("description")) || "No Description",
      status: formData.get("status") || "To start",
      priority: formData.get("priority") || "Low",
      dueDate:
        formData.get("due_date") || new Date().toISOString().split("T")[0],
      id: tasks.length + 1, // Tạo id tạm thời cho task
      todolistId: info.todolistId,
      userId: info.userId,
      createAt: new Date().toISOString().split("T")[0],
      updateAt: new Date().toISOString().split("T")[0],
    };
    return obj;
  }

  function validateTaskData(task) {
    const errors = [];
    if (!task.title) errors.push("Title must not be blank!");
    if (!task.description) errors.push("Description must not be blank!");
    if (!["High", "Medium", "Low"].includes(task.priority))
      errors.push("Priority is invalid");
    if (!["To start", "In progress", "Done"].includes(task.status))
      errors.push("Status is invalid!");
    if (!task.dueDate || isNaN(Date.parse(task.dueDate)))
      errors.push("Due Date is invalid!");
    if (!task.todolistId || isNaN(task.userId)) errors.push("User is invalid!");
    if (!task.todolistId || isNaN(task.todolistId))
      errors.push("Todolist is invalid!");

    if (errors.length) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  }

  function renderTasks(taskList) {
    let rows = taskList
      .map(
        (task) =>
          `
          <tr>
            <td>${task.id}</td>
            <td>${task.todolist.id}</td>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.status}</td>
            <td>${task.priority}</td>
            <td>${task.dueDate}</td>
            <td>${task.createAt}</td>
            <td>${task.updateAt}</td>
          </tr>
        `
      )
      .join("");

    container.innerHTML = rows;
  }

  function safeAlert(userInput) {
    const sanitizedInput = userInput.replace(
      /[<>"'&]/g,
      (match) =>
        ({
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "&": "&amp;",
        }[match])
    );

    return sanitizedInput;
  }

  form.addEventListener("submit", handleSubmit);

  async function handleSubmit(event) {
    event.preventDefault();

    let formData = getFormDataObject(form);
    if (!validateTaskData(formData)) return;

    try {
      if (!options.onSubmit) {
        throw new Error("onSubmit function is undefined!");
      }

      const response = await options.onSubmit(formData);
      console.log("Response:", response); //

      if (!response || !response.ok) {
        throw new Error("Error when creating a task!");
      }

      alert("Task created successfully!");
      location.reload();
    } catch (error) {
      console.error("Lỗi:", error);
      alert("There is an error when creating a task!");
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch(contextPath + "/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");

      tasks = await response.json();
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(tasks);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      loadTasksFromStorage(); // Dùng dữ liệu từ localStorage nếu có lỗi
    }
  }
  function loadTasksFromStorage() {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      console.log("Loaded tasks from localStorage:", tasks);
      renderTasks(tasks);
    }
  }
  function getTaskInfo() {
    const tasks = getTasksFromLocalStorage();
    return tasks.length > 0
      ? {
          todolistId: tasks[0].todolist?.id || null,
          userId: tasks[0].user?.id || null,
        }
      : null;
  }
  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }
  // Xóa localStorage chỉ khi rời trang không phải /home
  window.addEventListener("popstate", function () {
    if (!window.location.href.includes("/home")) {
      localStorage.removeItem("tasks");
    }
  });

  // Xử lý khi click về trang chủ
  // document.getElementById("homeButton")?.addEventListener("click", function () {
  //   localStorage.removeItem("tasks");
  //   window.location.href =
  //     contextPath + "/home?todolist_id=" + todolist.todolistId;
  // });

  fetchTasks();
}
// window.addEventListener("beforeunload", () => {
//   localStorage.removeItem("tasks");
// });

// window.addEventListener("popstate", function () {
//   if (!window.location.href.includes("/home")) {
//     localStorage.removeItem("tasks");
//   }
// });

// const homeBtn = document.getElementById("homeButton");
// homeBtn.addEventListener("click", function () {
//   localStorage.removeItem("tasks"); //xóa đi trên local
//   window.location.href = contextPath + "/home?todolist_id="; // Điều hướng về trang chủ
// });
