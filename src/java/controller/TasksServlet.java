/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import dal.TaskDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import model.Task;
import model.Todolist;
import model.User;

/**
 *
 * @author Admin
 */
@WebServlet(name = "TasksServlet", urlPatterns = {"/tasks"})
public class TasksServlet extends HttpServlet {
    // Create custom type adapter for LocalDate
    private static final TypeAdapter<LocalDate> LOCAL_DATE_ADAPTER = new TypeAdapter<LocalDate>() {
        @Override
        public void write(JsonWriter out, LocalDate value) throws IOException {
            out.value(value != null ? value.toString() : null);
        }

        @Override
        public LocalDate read(JsonReader in) throws IOException {
            String dateStr = in.nextString();
            return dateStr != null ? LocalDate.parse(dateStr) : null;
        }
    };

    // Configure Gson with the custom type adapter
    private static final Gson gson = new GsonBuilder()
        .registerTypeAdapter(LocalDate.class, LOCAL_DATE_ADAPTER)
        .create();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);
        User user = (User)session.getAttribute("account");
        Todolist todo = (Todolist)session.getAttribute("todoList");
        
        PrintWriter out = response.getWriter();
        
        try {
            
            TaskDAO taskDAO = new TaskDAO();
            List<Task> tasks = taskDAO.getTasksByTodoIdAndUserId(user.getId(), todo.getId());
            
            if (tasks == null) {
                sendJsonResponse(response, Collections.emptyList());
            } else {
                sendJsonResponse(response, tasks);
            }
        } catch (NumberFormatException e) {
            sendErrorResponse(response, "Invalid todolist_id format");
        } catch (Exception e) {
            sendErrorResponse(response, "Error processing request: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//        
//        try {
//            // Read JSON from request body
//            StringBuilder buffer = new StringBuilder();
//            BufferedReader reader = request.getReader();
//            String line;
//            while ((line = reader.readLine()) != null) {
//                buffer.append(line);
//            }
//            
//            // Parse JSON to Task object
//            Task newTask = gson.fromJson(buffer.toString(), Task.class);
//            
//            // Save task using DAO
//            TaskDAO taskDAO = new TaskDAO();
//            boolean success = true;
//            
//            if (success) {
//                Map<String, String> response_data = new HashMap<>();
//                response_data.put("status", "success");
//                response_data.put("message", "Task created successfully");
//                sendJsonResponse(response, response_data);
//            } else {
//                sendErrorResponse(response, "Failed to create task");
//            }
//        } catch (JsonSyntaxException e) {
//            sendErrorResponse(response, "Invalid JSON format");
//        } catch (Exception e) {
//            sendErrorResponse(response, "Error processing request: " + e.getMessage());
//        }
    }

    private void sendJsonResponse(HttpServletResponse response, Object data) throws IOException {
        PrintWriter out = response.getWriter();
        out.print(gson.toJson(data));
        out.flush();
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", message);
        sendJsonResponse(response, errorResponse);
    }
}