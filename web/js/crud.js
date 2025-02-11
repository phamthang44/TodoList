//mục tiêu là viết 1 hàm có thể dùng cho việc render dữ liệu ra giao diện co nhiều trang dạng table và có form trong đó ví dụ
//update, add
//còn delete thì ko cần ở đây hoặc có thể thì phải làm cho nó ask before confirming
// ngoài task ra thì còn 1 trang nữa dùng crud là todolist quản lí todolist đó là dashboard

let tasks = [];

function CrudTasks(options) {
  let form = document.querySelector(options.formSelector);
  let container = document.querySelector(options.renderArea);
  let contextPath = options.contextPath || "";

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

  function renderTasks(taskList) {
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

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn form submit mặc định

    let formData = getFormDataObject(form);

    try {
      let response = await options.onSubmit(formData); // Gọi onSubmit do bạn định nghĩa
      if (response.ok) {
        fetchTasks(); // Tải lại danh sách sau khi thêm thành công
        form.reset(); // Reset form sau khi gửi thành công
      } else {
        console.error("Lỗi khi gửi dữ liệu:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
  });

  fetchTasks();
}
