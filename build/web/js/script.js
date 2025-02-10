$(".menu > ul > li").click(function (e) {
  //remove active class from already active
  $(this).siblings().removeClass("active");
  //add active to clicked
  $(this).toggleClass("active");
  //if has sub menu open it
  $(this).find("ul").slideToggle();
  //close other sub menu if any open
  $(this).siblings().find("ul").slideUp();
  //remove active class of sub menu items
  $(this).siblings().find("ul").find("li").removeClass("active");
});

$(".menu-btn").click(function () {
  $(".sidebar").toggleClass("active");
});

let tasks = [];

async function fetchTasks() {
  try {
    const response = await fetch(contextPath + `/tasks`);
    tasks = await response.json();
    console.log(tasks);

    // Lọc từng nhóm theo status
    let toStart = tasks.filter((task) => task.status === "Pending");
    let inProgress = tasks.filter((task) => task.status === "In Progress");
    let done = tasks.filter((task) => task.status === "Done");

    renderTasks(".block__tostart.tasks", toStart);
    renderTasks(".block__inprogress.tasks", inProgress);
    renderTasks(".block__done.tasks", done);
  } catch (error) {}
}

function renderTasks(containerClass, tasks) {
  let container = document.querySelector(containerClass);

  container.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `<div class="task-card" draggable="true" data-id=${task.id}>
                    <div class="task-header">
                      <h3 class="task-title">${task.title}</h3>
                      <button class="task-options-btn">
                        <i class="fa fa-ellipsis-h"></i>
                      </button>
                      <div class="options-menu">
                        <ul>
                          <li><button class="edit">Edit Task</button></li>
                          <li><button class="edit">Delete Task</button></li>
                        </ul>
                      </div>
                    </div>
                    <p class="desc">
                      ${task.description}
                      
                    </p>
                    <p class="date create-date">Created at : ${task.createAt}</p>
                    <p class="date due-date">Due date : ${task.dueDate}</p>
                    <p class="date update-date">Updated at : ${task.updateAt}</p>
                  </div>`;
    container.appendChild(li);
  });
  const taskCards = document.querySelectorAll(".task-card"); // Chọn tất cả các .task-card

  taskCards.forEach((taskCard) => {
    taskCard.onclick = function (e) {
      const menu = $(this).find(".options-menu");

      // Nếu nhấn vào nút ba chấm
      if (e.target.closest(".task-options-btn")) {
        // Đóng tất cả các menu khác
        $(".task-item .task-card .options-menu")
          .not(menu)
          .removeClass("active");

        // Toggle (mở/đóng) menu của task hiện tại
        menu.toggleClass("active");
      } else {
        // Nếu nhấn vào vùng ngoài nút ba chấm, ẩn menu
        menu.removeClass("active");
      }
    };
  });
}

// Lấy `todolist_id` từ URL

fetchTasks();

document.addEventListener("DOMContentLoaded", function () {
  let draggedTask = null;

  // 1️⃣ Xử lý kéo
  document.querySelectorAll(".task-card").forEach((task) => {
    task.setAttribute("draggable", true); // Đảm bảo có thể kéo
    task.addEventListener("dragstart", function (event) {
      draggedTask = this;
      event.dataTransfer.setData("text/plain", this.getAttribute("data-id"));
      setTimeout(() => (this.style.opacity = "0.5"), 0);
    });

    task.addEventListener("dragend", function () {
      this.style.opacity = "1";
    });
  });

  // 2️⃣ Xử lý vùng dropzone
  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", function (event) {
      event.preventDefault();
      this.style.backgroundColor = "#f0f0f0";
    });

    zone.addEventListener("dragleave", function () {
      this.style.backgroundColor = "";
    });

    zone.addEventListener("drop", function (event) {
      event.preventDefault();
      this.style.backgroundColor = "";

      if (draggedTask) {
        this.appendChild(draggedTask); // Chuyển task vào cột mới

        let taskId = draggedTask.getAttribute("data-id");
        let newStatus =
          this.closest("div").querySelector("p.state").textContent; // Lấy tên trạng thái

        updateTaskStatus(taskId, newStatus); // Cập nhật dữ liệu
      }
    });
  });
});

// 3️⃣ Hàm cập nhật trạng thái trong dữ liệu
function updateTaskStatus(taskId, newStatus) {
  taskId = parseInt(taskId);
  let task = tasks.find((t) => t.id === taskId);
  console.log(task);
  if (task) {
    task.status = newStatus;
    console.log(`✅ Cập nhật Task ${taskId} -> ${newStatus}`);

    // 🛠 Nếu cần, gửi lên server bằng fetch API
    fetch("/updateTaskStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => console.log("📡 Server response:", data))
      .catch((err) => console.error("❌ Update failed:", err));
  }
}
