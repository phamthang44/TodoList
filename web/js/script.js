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
    // Lọc  status
    let toStart = tasks.filter((task) => task.status === "To start");
    let inProgress = tasks.filter((task) => task.status === "In progress");
    let done = tasks.filter((task) => task.status === "Done");

    renderTasks(".block__tostart.tasks", toStart);
    renderTasks(".block__inprogress.tasks", inProgress);
    renderTasks(".block__done.tasks", done);
  } catch (error) {}
}

function searchTasksByDate(fromDate, toDate, allTasks) {
  // Chuyển đổi thành dạng timestamp để so sánh
  const fromTimestamp = fromDate ? new Date(fromDate).getTime() : null;
  const toTimestamp = toDate ? new Date(toDate).getTime() : null;

  const filteredTasks = allTasks.filter((task) => {
    const taskDate = new Date(task.createAt).getTime(); // Hoặc updatedAt nếu muốn

    return (
      (!fromTimestamp || taskDate >= fromTimestamp) &&
      (!toTimestamp || taskDate <= toTimestamp)
    );
  });

  // Nhóm lại theo trạng thái
  const groupedTasks = {
    todo: filteredTasks.filter((task) => task.status === "To start"),
    inProgress: filteredTasks.filter((task) => task.status === "In progress"),
    done: filteredTasks.filter((task) => task.status === "Done"),
  };

  // Render lại giao diện
  renderTasks(".block__tostart.tasks", groupedTasks.todo);
  renderTasks(".block__inprogress.tasks", groupedTasks.inProgress);
  renderTasks(".block__done.tasks", groupedTasks.done);
}

// Bắt sự kiện khi nhấn tìm kiếm
document.querySelector(".date-filter").addEventListener("click", () => {
  const fromDate = document.querySelector(".input.input-date.from-date").value;
  const toDate = document.querySelector("input.input-date.to-date").value;
  console.log(fromDate, toDate);
  searchTasksByDate(fromDate, toDate, tasks);
});

// Hàm tìm kiếm và hiển thị task ngay lập tức mà không cần fetch API
function searchAndRenderTasks(keyword, allTasks) {
  // Lọc task theo từ khóa (tìm trong title hoặc description)
  const filteredTasks = allTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(keyword.toLowerCase()) ||
      task.description.toLowerCase().includes(keyword.toLowerCase())
  );

  // Nhóm tasks theo trạng thái (ví dụ: "todo", "in-progress", "done")
  const groupedTasks = {
    todo: filteredTasks.filter((task) => task.status === "To start"),
    inProgress: filteredTasks.filter((task) => task.status === "In progress"),
    done: filteredTasks.filter((task) => task.status === "Done"),
  };

  // Render lại từng nhóm task theo container tương ứng
  renderTasks(".block__tostart.tasks", groupedTasks.todo);
  renderTasks(".block__inprogress.tasks", groupedTasks.inProgress);
  renderTasks(".block__done.tasks", groupedTasks.done);
}

// Sự kiện onchange để tìm kiếm ngay khi nhập
document.querySelector("#search_input").addEventListener("input", (e) => {
  const keyword = e.target.value;
  searchAndRenderTasks(keyword, tasks); // allTasks là danh sách từ API
});
//mong muốn thứ nhất là tìm dựa trên keywords
//thứ 2 sắp xếp theo thứ tự hiện từ priority
//và cần xếp đúng chỗ task của status nào ra cái đó
//tìm theo quy tắc là title hoặc description trả về 1 danh sách task tìm thấy
//và sau đó sắp xếp render lại giao diện không cần gọi lại API

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
                        <button class="delete">Delete Task</button>
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
    taskItem.onclick = (e) => {
      const index = +taskItem.getAttribute("data-index");
      const task = tasks[index];
      console.log(e.target);
      if (e.target.closest(`${containerClass} .task-item .task-options-btn`)) {
        // Check if delete button is clicked

        const menu = taskItem.querySelector(".options-menu");
        document
          .querySelectorAll(".task-item .task-card .options-menu")
          .forEach((otherMenu) => {
            if (otherMenu !== menu) {
              otherMenu.classList.remove("active");
            }
          });
        menu.classList.toggle("active");

        const deleteButtons = document.querySelectorAll(".delete");
        if (deleteButtons) {
          deleteButtons.forEach((deleteButton) => {
            deleteButton.onclick = (e) => {
              if (e.target === deleteButton) {
                const confirmMsg = new ConfirmCard();
                e.stopPropagation(); // Stop event from propagating to the parent taskItem.onclick
                confirmMsg.openConfirmCard(`
                  <p class="card-heading">Delete this task?</p>
                  <p class="card-description">Are you sure that you want to delete <span class="strong-text">${task.title}</span></p>
                  <p class="card-description card-info">ID : <span class="strong-text" data-task-id="${task.id}">${task.id}</span></p>
                  `);
                menu.classList.toggle("active");
              }
            };
          });
        }
      } else {
        document
          .querySelectorAll(".task-item .task-card .options-menu")
          .forEach((menu) => {
            menu.classList.remove("active");
          });

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

async function deleteTask(task) {
  if (!task.id) return alert("Task ID is missing!");
  if (!task.todolist.id) return alert("Todolist ID is missing!");
  try {
    const response = await fetch(contextPath + "/deletetask", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, todolistId: task.todolist.id }),
    });

    if (!response.ok) throw new Error("Delete failed!");

    const data = await response.json();
    if (data) {
      window.location.href =
        contextPath + "/home?todolist_id=" + data.todolistId;
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    alert("Failed to delete task!");
  }
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
      window.location.href =
        contextPath + "/home?todolist_id=" + data.todolistId;
    }
  } catch (error) {
    console.error("Error updating task:", error);
    alert("Failed to update task!");
  }
}

// Corrected form event listener

function addNewTaskButtonOnList() {
  const addNewTask = document.createElement("li");
  addNewTask.classList.add("task-item");
  addNewTask.innerHTML = `<div class="place-to-add">
                              <button class="add-task-btn">Add new task</button>
                            </div>`;
}

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

fetchTasks();

// test
// document.addEventListener("click", function (event) {
//   console.log(event.target);
//   if (event.target.matches(".delete")) {

//   }
// });

// ------------ CONFIRM CARD ------------------------------s
function ConfirmCard() {
  this.openConfirmCard = (content) => {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";

    const confirmCard = document.createElement("div");
    confirmCard.className = "card";

    const closeButton = document.createElement("button");
    closeButton.className = "exit-button";
    closeButton.innerHTML = `<svg height="20px" viewBox="0 0 384 512">
      <path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
      ></path>
    </svg>`;
    //content like delete file, delete task, update, ....
    const cardConfirmContent = document.createElement("div");
    cardConfirmContent.className = "card-content";
    cardConfirmContent.innerHTML = content;

    //button wrapper yes / no
    const cardConfirmButtonWrapper = document.createElement("div");
    cardConfirmButtonWrapper.className = "card-button-wrapper";
    const buttonCancel = document.createElement("button");
    buttonCancel.className = "card-button secondary";
    buttonCancel.innerText = "Cancel";

    const buttonYes = document.createElement("button");
    buttonYes.className = "card-button primary";
    buttonYes.innerText = "Yes";

    cardConfirmButtonWrapper.append(buttonCancel, buttonYes);
    confirmCard.append(
      cardConfirmContent,
      cardConfirmButtonWrapper,
      closeButton
    );
    backdrop.append(confirmCard);
    document.body.append(backdrop);

    //to make this one have animation transition
    setTimeout(() => {
      backdrop.classList.add("show");
    }, 0);

    buttonYes.onclick = (e) => {
      this.closeConfirm(backdrop);
      const chosenTaskCard = e.target.closest(".card");
      const taskInfo = chosenTaskCard.querySelector(
        ".card-description.card-info .strong-text"
      );

      const taskId = +taskInfo.dataset.taskId;

      if (taskId) {
        const task = tasks.find((task) => task.id === taskId);

        if (!task) return alert("Task not found!");
        deleteTask(task);
      } else return alert("Task ID is missing!");
    };

    closeButton.onclick = () => this.closeConfirm(backdrop);
    buttonCancel.onclick = () => this.closeConfirm(backdrop);

    this.closeConfirm = (modalElement) => {
      modalElement.classList.remove("show");
      // document.body.removeChild(modalElement);
      modalElement.ontransitionend = () => {
        modalElement.remove();
      };
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal(backdrop);
      }
    });
  };
}

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

Array.prototype.sortByPriority = function () {
  const priorityMap = {
    High: 3,
    Medium: 2,
    Low: 1,
  };
  this.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority]);
};
