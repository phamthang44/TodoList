/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dal.TaskDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.util.Map;
import java.util.stream.Collectors;
import model.Task;

/**
 *
 * @author Admin
 */
public class UpdateTaskServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet UpdateTaskServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet UpdateTaskServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        String todolistId = request.getParameter("todolist_id");
        
        BufferedReader reader = request.getReader();
        String json = reader.lines().collect(Collectors.joining());
        
        if (json.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Request body is empty!");
            return;
        }

        // Chuyển JSON thành Map thay vì Object Task
        Task task = objectMapper.readValue(json, Task.class);

        if (task.getId() <= 0) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "{\"error\": \"Task ID is required!\"}");
            return;
        }
        
        
        
        TaskDAO taskDAO = new TaskDAO();
       
        taskDAO.updateTask(task.getTitle(), task.getDescription(), task.getPriority(), task.getStatus(), task.getId());
        
        response.sendRedirect("/home?todolist_id=" + task.getTodolist().getId());
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
