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
    console.log(contextPath);
    const response = await fetch(contextPath + `/tasks`);
    tasks = await response.json();
    console.log(tasks);

    // Lọc từng nhóm theo status
    let toStart = tasks.filter((task) => task.status === "To start");
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

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.setAttribute("data-index", index);
    li.innerHTML = `<div class="task-card" data-id=${task.id}>
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
  const taskItems = document.querySelectorAll(`${containerClass} .task-item`);
  taskItems.forEach((taskItem) => {
    const modal = new Modal();
    taskItem.onclick = () => {
      const index = +taskItem.getAttribute("data-index");
      const task = tasks[index];

      if (!task) {
        console.error("Task not found for index:", index, filteredTasks);
        return;
      }

      modal.openModal(`<h3 class="modal-detail title">${task.title}</h3>
          <p class="modal-detail description">${task.description}</p>
          <p class="modal-detail status">Status : <span class="text-style" data-status="${task.status}">${task.status}</span></p>
          <p class="modal-detail priority">Priority : <span class="text-style" data-priority="${task.priority}">${task.priority}</span></p>
          <p class="modal-detail date">Created at : ${task.createAt}</p>
          <p class="modal-detail date">Updated at : ${task.updateAt}</p>`);
    };
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

// document.addEventListener("DOMContentLoaded", function () {
//   let draggedTask = null;

//   // 1️⃣ Xử lý kéo
//   document.querySelectorAll(".task-card").forEach((task) => {
//     task.setAttribute("draggable", true); // Đảm bảo có thể kéo
//     task.addEventListener("dragstart", function (event) {
//       draggedTask = this;
//       event.dataTransfer.setData("text/plain", this.getAttribute("data-id"));
//       setTimeout(() => (this.style.opacity = "0.5"), 0);
//     });

//     task.addEventListener("dragend", function () {
//       this.style.opacity = "1";
//     });
//   });

//   // 2️⃣ Xử lý vùng dropzone
//   document.querySelectorAll(".dropzone").forEach((zone) => {
//     zone.addEventListener("dragover", function (event) {
//       event.preventDefault();
//       this.style.backgroundColor = "#f0f0f0";
//     });

//     zone.addEventListener("dragleave", function () {
//       this.style.backgroundColor = "";
//     });

//     zone.addEventListener("drop", function (event) {
//       event.preventDefault();
//       this.style.backgroundColor = "";

//       if (draggedTask) {
//         this.appendChild(draggedTask); // Chuyển task vào cột mới

//         let taskId = draggedTask.getAttribute("data-id");
//         let newStatus =
//           this.closest("div").querySelector("p.state").textContent; // Lấy tên trạng thái

//         updateTaskStatus(taskId, newStatus); // Cập nhật dữ liệu
//       }
//     });
//   });
// });

// // 3️⃣ Hàm cập nhật trạng thái trong dữ liệu
// function updateTaskStatus(taskId, newStatus) {
//   taskId = parseInt(taskId);
//   let task = tasks.find((t) => t.id === taskId);
//   console.log(task);
//   if (task) {
//     task.status = newStatus;
//     console.log(`✅ Cập nhật Task ${taskId} -> ${newStatus}`);

//     // 🛠 Nếu cần, gửi lên server bằng fetch API
//     fetch("/updateTaskStatus", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ id: taskId, status: newStatus }),
//     })
//       .then((res) => res.json())
//       .then((data) => console.log("📡 Server response:", data))
//       .catch((err) => console.error("❌ Update failed:", err));
//   }
// }
// ------------- MODAL BLOCK --------------------

function createModalTaskCard(task) {
  const backDrop = document.getElementsByTagName("body");
  const taskCard = document.querySelector(".task-item");
  taskCard.onclick = function (e) {
    if (e.target === this) {
      backDrop.innerHTML = `
    <div class="modal-backdrop">
      <div class="modal-container">
        <button id="modal-editable" class="modal-editable">Edit</button>
        <button id="modal-close" class="modal-close">&times;</button>
        <div class="modal-content">
          <h3 class="task-card--title">${task.title}</h3>
          <p class="task-card--description">${task.description}</p>
          <p class="task-card--status">${task.status}</p>
          <p class="task-card--priority">${task.priority}</p>
          <p class="date">${task.createAt}</p>
          <p class="date">${task.updateAt}</p>
        </div>
      </div>
    </div>`;
    }
  };
}

function Modal() {
  this.openModal = (content) => {
    //Create modal elements
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const container = document.createElement("div");
    container.className = "modal-container";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.innerHTML = "&times;";

    const editableBtn = document.createElement("button");
    editableBtn.className = "modal-editable";
    editableBtn.innerText = "Click to edit";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    //Append content and elements
    modalContent.innerHTML = content;
    container.append(closeBtn, modalContent, editableBtn);
    backdrop.append(container);
    document.body.append(backdrop);

    //backdrop.classList.add("show");
    setTimeout(() => {
      backdrop.classList.add("show");
    }, 0);

    // Attach event listeners
    closeBtn.onclick = () => this.closeModal(backdrop);
    backdrop.onclick = (e) => {
      console.log(e.target);
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });
  };

  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    // document.body.removeChild(modalElement);
    modalElement.ontransitionend = () => {
      modalElement.remove();
    };
  };
}
