<%-- Document : add Created on : Feb 10, 2025, 1:59:27 PM Author : Admin --%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Task Manager</title>
    <style>
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f4f4f4;
      }
      form {
        margin-bottom: 20px;
      }

      .invalid {
        color: red;
        font-weight: 500;
      }
      .spacer {
        margin: 36px 0;
      }
    </style>
  </head>
  <body>
    <h2>Tasks list</h2>

    <!-- Form thêm Task -->
    <form id="taskForm">
      <input type="text" id="title" placeholder="Title" />
      <input type="text" id="description" placeholder="Description" />
      <select id="status">
        <option value="To start">To start</option>
        <option value="In progress">In progress</option>
        <option value="Done">Done</option>
      </select>
      <select id="priority">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <label for="due_date">Due date:</label>
      <input type="date" id="due_date" />
      <button type="submit">Thêm Task</button>
    </form>
    <span class="msg"></span>
    <div class="spacer"></div>
    <!-- Bảng hiển thị danh sách Task -->
    <table>
      <thead>
        <tr>
          <th>Task ID</th>
          <th>To-Do List ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody id="taskTableBody">
        <!-- Tasks sẽ được thêm vào đây -->
      </tbody>
    </table>
    <script src="./js/crud.js"></script>

    <script>
      function validate(inputElement1, inputElement2) {
        let errorMsg;
        let inputValue1 = inputElement1.value;
        let inputValue2 = inputElement2.value;
        if (!inputValue1 || !inputValue2) {
          errorMsg = "This field is required";
          return errorMsg;
        } else if (hasWhiteSpace(inputValue1) || hasWhiteSpace(inputValue1)) {
          errorMsg = "This field should not have any white spaces!";
        } else {
          errorMsg = "";
        }
        return errorMsg;
      }

      function hasWhiteSpace(s) {
        return /\s/g.test(s);
      }
      var contextPath = "<%= request.getContextPath() %>";
      let errorMsg = document.querySelector(".msg");
      const form = document.querySelector("#taskForm");
      let inputDescElement = document.querySelector("#description");
      let inputTitleElement = document.querySelector("#title");

      let inputs = [inputTitleElement, inputDescElement];
      // Xử lý sự kiện onblur cho các ô input
      inputs.forEach((inputElement) => {
        inputElement.onblur = function () {
          errorMsg.textContent = validate(inputTitleElement, inputDescElement);
          if (errorMsg.textContent) {
            errorMsg.classList.add("invalid");
          } else {
            errorMsg.classList.remove("invalid");
          }
        };
      });
      // Kiểm tra khi form submit
      form.onsubmit = function (e) {
        errorMsg.textContent = validate(inputTitleElement, inputDescElement);
        if (errorMsg.textContent) {
          errorMsg.classList.add("invalid");
          e.preventDefault(); // Ngừng việc gửi form nếu có lỗi
        }
      };

      CrudTasks({
        formSelector: "#taskForm",
        renderArea: "#taskTableBody",
        contextPath: contextPath,
        onSubmit: async function (data) {
          return await fetch(contextPath + "/addnewtask", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        },
      });
    </script>
  </body>
</html>
