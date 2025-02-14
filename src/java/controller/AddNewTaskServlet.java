/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dal.TaskDAO;
import dal.TodolistDAO;
import dal.UserDAO;
import dto.TaskDTO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.util.stream.Collectors;
import model.Task;
import model.Todolist;
import model.User;

/**
 *
 * @author Admin
 */
@WebServlet(name = "AddNewTaskServlet", urlPatterns = {"/addnewtask"})
public class AddNewTaskServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet AddNewTaskServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet AddNewTaskServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("addtask.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //viết logic để đầu tiên là load các task của thg todolist lên trang trước khi thêm mới để 
        //lấy id cuối cùng của task cuối cùng 
        //sau đó + thêm 1

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        BufferedReader reader = request.getReader();
        String json = reader.lines().collect(Collectors.joining());
        Task newTask = new Task();

        TodolistDAO todolistDAO = new TodolistDAO();
        UserDAO userdao = new UserDAO();
        TaskDAO taskDAO = new TaskDAO();

        if (json.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Request body is empty!");
            return;
        }

        TaskDTO taskDTO = objectMapper.readValue(json, TaskDTO.class);

        if (taskDTO.getTitle() == null || taskDTO.getTitle().trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Title must not be blank!");
            return;
        }

        if (taskDTO.getDescription() == null || taskDTO.getDescription().trim().isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Description must not be blank!");
            return;
        }

        if (taskDTO.getPriority() == null
                || !(taskDTO.getPriority().equals("High") || taskDTO.getPriority().equals("Medium") || taskDTO.getPriority().equals("Low"))) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Priority is invalid!");
            return;
        }

        if (taskDTO.getStatus() == null
                || !(taskDTO.getStatus().equals("To start") || taskDTO.getStatus().equals("In progress") || taskDTO.getStatus().equals("Completed"))) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Status is invalid!");
            return;
        }

        if (taskDTO.getDueDate() == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Due Date is invalid!");
            return;
        }

        if (taskDTO.getUserId() <= 0) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User is invalid!");
            return;
        }

        if (taskDTO.getTodolistId() <= 0) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Todolist is invalid!");
            return;
        }

        User user = userdao.getUserById(taskDTO.getUserId());
        Todolist todolist = todolistDAO.getTodolistById(taskDTO.getTodolistId());

        if (user == null || todolist == null) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User or Todolist is not existed!");
            return;
        }

        newTask.setTitle(taskDTO.getTitle());
        newTask.setDescription(taskDTO.getDescription());
        newTask.setId(taskDTO.getId());
        newTask.setPriority(taskDTO.getPriority());
        newTask.setStatus(taskDTO.getStatus());
        newTask.setCreateAt(taskDTO.getCreateAt());
        newTask.setDueDate(taskDTO.getDueDate());
        newTask.setUpdateAt(taskDTO.getUpdateAt());
        newTask.setUser(user);
        newTask.setTodolist(todolist);

        taskDAO.insertWithFullData(newTask);
        response.getWriter().write("{\"message\": \"Task added successfully\"}");
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
