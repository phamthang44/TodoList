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

const taskCards = document.querySelectorAll(".task-card"); // Chọn tất cả các .task-card

taskCards.forEach((taskCard) => {
  taskCard.onclick = function (e) {
    const menu = $(this).find(".options-menu");

    // Nếu nhấn vào nút ba chấm
    if (e.target.closest(".task-options-btn")) {
      // Đóng tất cả các menu khác
      $(".task-card .options-menu").not(menu).removeClass("active");

      // Toggle (mở/đóng) menu của task hiện tại
      menu.toggleClass("active");
    } else {
      // Nếu nhấn vào vùng ngoài nút ba chấm, ẩn menu
      menu.removeClass("active");
    }
  };
});

// async function loadTasks() {
//   try {
//     let response = await fetch("http://localhost:9999/todolist/api/tasks"); // API lấy danh sách task
//     let tasks = await response.json(); // Chuyển JSON thành object
//     console.log(tasks);

//     let taskList = document.getElementById("taskList"); // Lấy danh sách ul
//     taskList.innerHTML = ""; // Xóa nội dung cũ trước khi render mới

//     tasks.forEach((task) => {
//       let li = document.createElement("li");
//       li.classList.add("task-item-card");

//       li.innerHTML = `
//               <div class="task-card">
//                   <div class="task-header">
//                       <h3 class="task-title">${task.title}</h3>
//                       <button class="task-options-btn">
//                           <i class="fa fa-ellipsis-h"></i>
//                       </button>
//                   </div>
//                   <div class="options-menu">
//                       <ul>
//                           <li class="edit-task" data-id="${
//                             task.id
//                           }">Edit Task</li>
//                           <li class="delete-task" data-id="${
//                             task.id
//                           }">Delete Task</li>
//                       </ul>
//                   </div>
//                   <p class="desc">${
//                     task.description ? task.description : "No description"
//                   }</p>
//                   <p class="due-date">${
//                     task.dueDate ? task.dueDate : "No due date"
//                   }</p>
//               </div>
//           `;

//       taskList.appendChild(li);
//     });
//   } catch (error) {
//     console.error("Error loading tasks:", error);
//   }
// }

// // Gọi hàm khi trang web load
// document.addEventListener("DOMContentLoaded", loadTasks);
