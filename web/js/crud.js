//mục tiêu là viết 1 hàm có thể dùng cho việc render dữ liệu ra giao diện co nhiều trang dạng table và có form trong đó ví dụ
//update, add
//còn delete thì ko cần ở đây hoặc có thể thì phải làm cho nó ask before confirming
// ngoài task ra thì còn 1 trang nữa dùng crud là todolist quản lí todolist đó là dashboard

let tasks = [];

function CrudTasks(options) {
  let formSelector = document.querySelector(options.selector);
  let container = document.querySelector(options.renderArea);
  let contextPath = options.contextPath || "";

  if (formSelector) {
    formSelector.addEventListener("submit", function (e) {
      e.preventDefault();

      let formDataObject = getFormDataObject(formSelector);

      // Thêm task vào danh sách
      tasks.push(formDataObject);

      // Render lại danh sách
      renderTasks(tasks, container);
    });
  }

  function getFormDataObject(selector) {
    let formData = {};
    let inputs = selector.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      let name = input.name || input.id;
      if (!name) return;

      let value = input.value.trim();
      formData[name] = value;
    });

    return formData;
  }

  function renderTasks(taskList, container) {
    if (!container) {
      console.error("Container không tồn tại!");
      return;
    }

    if (!taskList || taskList.length === 0) {
      container.innerHTML = "<tr><td colspan='9'>Không có dữ liệu</td></tr>";
      return;
    }

    let rows = taskList
      .map(
        (task, index) =>
          `
          <tr>
            <td>${task.id ?? "N/A"}</td>
            <td>${task.todolist.id ?? "N/A"}</td>
            <td>${task.title ?? "No Title"}</td>
            <td>${task.description ?? "No Description"}</td>
            <td>${task.status ?? "Pending"}</td>
            <td>${task.priority ?? "Normal"}</td>
            <td>${task.dueDate ?? "N/A"}</td>
            <td>${task.createAt ?? "N/A"}</td>
            <td>${task.updateAt ?? "N/A"}</td>
          </tr>
        `
      )
      .join("");

    container.innerHTML = rows;
  }

  async function fetchTasks() {
    try {
      const response = await fetch(contextPath + "/tasks");
      tasks = await response.json();
      renderTasks(tasks, container);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }

  fetchTasks();
}

// document
//   .getElementById("taskForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault(); // Ngăn form gửi đi

//     const taskId = tasks.length + 1;
//     const todoListId = 1; // Giả sử mặc định là 1
//     const title = document.getElementById("title").value;
//     const description = document.getElementById("description").value;
//     const status = document.getElementById("status").value;
//     const priority = document.getElementById("priority").value;
//     const today = new Date();
//     const dueDate =
//       document.getElementById("due_date").value ??
//       today.toISOString().split("T")[0];
//     const createdAt = today.toISOString().split("T")[0];
//     const updatedAt = createdAt;

//     // Thêm task vào danh sách
//     const newTask = {
//       taskId: taskId,
//       todoListId: todoListId,
//       title: title,
//       description: description,
//       status: status,
//       priority: priority,
//       dueDate: dueDate,
//       createdAt: createdAt,
//       updatedAt: updatedAt,
//     };

//     tasks.push(newTask);

//     console.log(tasks);
//     renderTasks();

//     // Reset form
//     document.getElementById("taskForm").reset();
//   });

// function renderTasks() {
//   const tableBody = document.getElementById("taskTableBody");
//   let rows = ""; // Tạo chuỗi HTML

//   tasks.forEach((task) => {
//     console.log(task);
//     //dm lỗi template String là do \${} JSP EL nó cũng nhận luôn nên gây lỗi
//     //giải pháp sau này \$ để tránh lỗi
//     rows += `<td>\${task.taskId ?? "N/A"}</td>
//                   <td>\${task.todoListId ?? "N/A"}</td>
//                   <td>\${task.title ?? "No Title"}</td>
//                   <td>\${task.description ?? "No Description"}</td>
//                   <td>\${task.status ?? "Pending"}</td>
//                   <td>\${task.priority ?? "Normal"}</td>
//                   <td>\${task.dueDate}</td>
//                   <td>\${task.createdAt ?? "N/A"}</td>
//                   <td>\${task.updatedAt ?? "N/A"}</td>`;
//   });

//   tableBody.innerHTML = rows; // Cập nhật bảng một lần
// }
