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

    tasks.sortByPriority();
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
                    <span class="task-priority">Priority : <span class="text-style" data-priority="${task.priority}">${task.priority}</span></span>
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

      modal.openModal(`
        <form class="updateTask" method="put" id="updateTask">
          <h3 class="modal-detail title" id="taskTitle">${task.title}</h3>
          <p class="modal-detail description" id="taskDescription">${task.description}</p>
          <p><label>Status : </label><span class="modal-detail status text-style" data-status="${task.status}">${task.status}</span></p>
          <p><label>Priority : </label><span class="modal-detail priority text-style" data-priority="${task.priority}">${task.priority}</span></p>
          <p class="modal-detail date">Created at : ${task.createAt}</p>
          <p class="modal-detail update-date date">Updated at : ${task.updateAt}</p>
          
          <span class="form-message"></span>
          <button type="submit" class="save-btn" id="updateTaskSubmit" 
          data-task-id="${task.id}"
          data-todolist-id="${task.todolist.id}" >Save</button>
        </form>`);
      const form = document.querySelector("#updateTask");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitter = event.submitter; // Get the submit button
        const taskId = submitter.dataset.taskId;
        const todolistId = submitter.dataset.todolistId;

        updateTask(form, submitter, taskId, todolistId, task);
      });
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

function getFormDataObject(form, submitter, task) {
  let formData = new FormData(form, submitter);
  return {
    title: formData.get("title") || task.title,
    description: formData.get("description") || task.description,
    status: formData.get("status") || task.status,
    priority: formData.get("priority") || task.priority,
    updateAt: new Date().toISOString().split("T")[0] || task.updateAt,
  };
}

async function updateTask(form, submitter, id, todolist_id, task) {
  const updateInfos = getFormDataObject(form, submitter, task);

  const taskId = id;
  const { title, description, status, priority, updateAt } = updateInfos;
  const todolistId = todolist_id;
  if (!taskId) return alert("Task ID is missing!");
  if (!title.trim() || !description.trim())
    return alert("Please input valid info!");
  if (!todolist_id) return alert("Todolist ID is missing!");

  try {
    const response = await fetch(contextPath + "/updatetask", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: taskId,
        title: title,
        description: description,
        status: status,
        priority: priority,
        updateAt: updateAt,
        todolistId: todolistId, // Ensure this is included
      }),
    });

    if (!response.ok) throw new Error("Update failed!");

    const data = await response.json();
    if (data) {
      refreshUpdatedData(data);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task!");
  }
}

// Corrected form event listener
// document.addEventListener("submit", function (event) {
//   if (event.target.matches("#updateTask")) {
//     event.preventDefault(); // Stop page reload

//     const form = event.target;
//     const submitter = event.submitter; // Get the submit button

//     const taskId = submitter.dataset.taskId;
//     const todolistId = submitter.dataset.todolistId;

//     updateTask(form, submitter, taskId, todolistId);
//   }
// });

function refreshUpdatedData(data) {
  const updatedTaskCards = document.querySelectorAll(".task-card");
  updatedTaskCards.forEach((updatedTaskCard) => {
    if (updatedTaskCard.dataset.id === data.id) {
      const updatedTaskTitle = updatedTaskCard.querySelector(".task-title");
      const updatedTaskDesc = updatedTaskCard.querySelector(".desc");
      const updatedTaskDate = updatedTaskCard.querySelector(".update-date");
      updatedTaskTitle.innerText = `${data.title}`;
      updatedTaskDesc.innerText = `${data.description}`;
      updatedTaskDate.innerText = `${data.updateAt}`;
    }
  });
}

function updateDataModal(data) {
  const updatedTitle = document.querySelector("#taskTitle");
  const updatedDesc = document.querySelector("#taskDescription");
  const updatedStatus = document.querySelector(".modal-detail.status");
  const updatedPriority = document.querySelector(".modal-detail.priority");
  const updatedDate = document.querySelector(".modal-detail.update-date");

  updatedTitle.innerText = `${data.title}`;
  updatedDesc.innerText = `${data.description}`;
  updatedStatus.innerText = `${data.status}`;
  updatedStatus.dataset.status = `${data.status}`;
  updatedPriority.innerText = `${data.priority}`;
  updatedPriority.dataset.priority = `${data.priority}`;
  updatedDate.innerText = `Updated at : ${data.updateAt}`;
}
// async function updateTask(form, submitter, id, todolist_id) {
//   const updateInfos = getFormDataObject(form, submitter);
//   const taskId = id;
//   const { title, description, status, priority, updateAt } = updateInfos;
//   const todolistId = todolist_id;
//   if (!id) return alert("Task ID is missing!");
//   if (!title.trim() || !description.trim())
//     return alert("Please input valid info!");

//   try {
//     const response = await fetch(contextPath + "/updatetask", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id: taskId,
//         title,
//         description,
//         status,
//         priority,
//         updateAt,
//         todolistId: todolistId,
//       }),
//     });

//     if (!response.ok) throw new Error("Update failed!");

//     const data = await response.json();
//     alert("Task updated successfully!");
//     console.log("Updated Task:", data);
//     window.location.href = contextPath + "/home?todolist_id=" + todolistId;
//   } catch (error) {
//     console.error("Error updating task:", error);
//     alert("Failed to update task!");
//   }
// }

fetchTasks();

//update function
// document.addEventListener("submit", function (event) {
//   if (event.target.matches("#updateTask")) {
//     const form = event.target.matches("#updateTask");
//     const submitter = event.target.matches("#updateTaskSubmit");
//     const taskId = event.target.matches("#taskId");
//     const id = +taskId.data.id;

//     event.preventDefault(); // Ngăn chặn reload trang
//     updateTask(form, submitter, id);
//   }
// });

// async function sendingTask(data) {
//   console.log("Sending data:", JSON.stringify(data));
//   return await fetch(contextPath + "/updatetask", {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
// }

// ------------- MODAL BLOCK --------------------

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

    const cancelEdit = document.createElement("button");
    cancelEdit.className = "cancel";
    cancelEdit.innerText = "Cancel edit";

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
    // backdrop.onclick = (e) => {
    //   console.log(e.target);
    //   if (e.target === backdrop) {
    //     this.closeModal(backdrop);
    //   }
    // };
    let backdropClickListener = (e) => {
      console.log(e.target);
      if (e.target === backdrop) {
        this.closeModal(backdrop);
      }
    };

    backdrop.addEventListener("click", backdropClickListener);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });

    editableBtn.onclick = () => {
      backdrop.removeEventListener("click", backdropClickListener);
      this.changeEditableState(modalContent);
      container.append(cancelEdit);
      closeBtn.remove();
    };

    cancelEdit.onclick = () => {
      this.cancelEditChange();
      this.closeModal(backdrop);
    };
  };

  this.closeModal = (modalElement) => {
    modalElement.classList.remove("show");
    // document.body.removeChild(modalElement);
    modalElement.ontransitionend = () => {
      modalElement.remove();
    };
  };

  this.cancelEditChange = () => {
    this.originalValues.forEach((value, element) => {
      let newElement = document.createElement(element.tagName.toLowerCase());
      newElement.className = element.className;
      newElement.textContent = value;
      element.replaceWith(newElement);
    });
    this.originalValues.clear();
  };

  this.changeEditableState = () => {
    this.originalValues = new Map(); // Map save original content
    const details = document.querySelectorAll(".modal-detail");
    details.forEach((detail) => {
      if (detail.classList.contains("date")) return;

      this.originalValues.set(detail, detail.innerHTML.trim());

      let newElement;
      let fieldName = detail.classList[1] || "field";
      let currentValue = detail.textContent.trim();

      if (detail.classList.contains("description")) {
        // If description use textarea
        newElement = document.createElement("textarea");
        newElement.value = detail.textContent.trim();
        newElement.name = "description";
        newElement.required = true;
      } else if (
        detail.classList.contains("priority") ||
        detail.classList.contains("status")
      ) {
        newElement = document.createElement("select");

        let options = [];
        if (detail.classList.contains("priority")) {
          options = ["Low", "Medium", "High"];
        } else if (detail.classList.contains("status")) {
          options = ["To start", "In progress", "Done"];
        }

        options.forEach((option) => {
          let optElement = document.createElement("option");
          optElement.value = option;
          optElement.textContent = option;
          if (option === currentValue) optElement.selected = true;
          newElement.appendChild(optElement);
        });
      } else {
        // other -> text
        newElement = document.createElement("input");
        newElement.type = "text";
      }
      newElement.value = detail.textContent.trim();
      newElement.name = fieldName;
      newElement.required = true;
      newElement.classList.add(...detail.classList);
      detail.replaceWith(newElement);
    });
  };
}

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

Array.prototype.sortByPriority = function () {
  const priorityMap = {
    High: 3,
    Medium: 2,
    Low: 1,
  };
  this.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
};
