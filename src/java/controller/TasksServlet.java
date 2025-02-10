/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.TaskDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import model.Task;
import model.Todolist;
import model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.PrintWriter;

/**
 *
 * @author Admin
 */
@WebServlet(name = "TasksServlet", urlPatterns = {"/tasks"})
public class TasksServlet extends HttpServlet {
    
    private final ObjectMapper objectMapper = new ObjectMapper()
    .registerModule(new JavaTimeModule()) // Hỗ trợ LocalDate
    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        if (session == null) {
            sendErrorResponse(response, "Session not found");
            return;
        }

        User user = (User) session.getAttribute("account");
        Todolist todo = (Todolist) session.getAttribute("todoList");

        if (user == null || todo == null) {
            sendErrorResponse(response, "User or TodoList not found in session");
            return;
        }

        try {
            TaskDAO taskDAO = new TaskDAO();
            List<Task> tasks = taskDAO.getTasksByTodoIdAndUserId(user.getId(), todo.getId());

            sendJsonResponse(response, tasks);
        } catch (Exception e) {
            sendErrorResponse(response, "Error processing request: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Xử lý POST nếu cần
    }

    private void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        try {
            String json = objectMapper.writeValueAsString(data);
            PrintWriter out = response.getWriter();
            out.print(json);
            out.flush();
        } catch (Exception e) {
            e.printStackTrace();
            sendErrorResponse(response, "JSON serialization error: " + e.getMessage());
        }
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        sendJsonResponse(response, errorResponse);
    }
}