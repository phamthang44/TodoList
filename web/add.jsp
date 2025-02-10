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
    </style>
  </head>
  <body>
    <h2>Tasks list</h2>

    <!-- Form thêm Task -->
    <form id="taskForm">
      <input type="text" id="title" placeholder="Title" required />
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

    <script>
      let tasks = []; // Mảng lưu danh sách task

      document
        .getElementById("taskForm")
        .addEventListener("submit", function (event) {
          event.preventDefault(); // Ngăn form gửi đi

          const taskId = tasks.length + 1;
          const todoListId = 1; // Giả sử mặc định là 1
          const title = document.getElementById("title").value;
          const description = document.getElementById("description").value;
          const status = document.getElementById("status").value;
          const priority = document.getElementById("priority").value;
          const dueDate = document.getElementById("due_date").value || "N/A";
          const createdAt = new Date().toISOString();
          const updatedAt = createdAt;

          // Thêm task vào danh sách
          const newTask = {
            taskId,
            todoListId,
            title,
            description,
            status,
            priority,
            dueDate,
            createdAt,
            updatedAt,
          };
          tasks.push(newTask);
          renderTasks();

          // Reset form
          document.getElementById("taskForm").reset();
        });

      function renderTasks() {
        const tableBody = document.getElementById("taskTableBody");
        tableBody.innerHTML = ""; // Xóa nội dung cũ
        tasks.forEach((task) => {
          const row = `<tr>
                    <td>${task.taskId}</td>
                    <td>${task.todoListId}</td>
                    <td>${task.title}</td>
                    <td>${task.description}</td>
                    <td>${task.status}</td>
                    <td>${task.priority}</td>
                    <td>${task.dueDate}</td>
                    <td>${task.createdAt}</td>
                    <td>${task.updatedAt}</td>
                </tr>`;
          tableBody.innerHTML += row;
        });
      }
    </script>
  </body>
</html>
