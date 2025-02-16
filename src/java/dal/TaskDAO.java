/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import model.Task;
import model.Todolist;
import model.User;

public class TaskDAO extends DatabaseConnection {

    public List<Task> getAllTasksByTodoId(int id) {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT * FROM `tasks` WHERE `todolist_id`=?";
        Task task;
        User user;
        UserDAO udao = new UserDAO();
        TodolistDAO tododao = new TodolistDAO();
        Todolist todo;
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, id);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                task = new Task();
                todo = tododao.getTodolistById(rs.getInt("todolist_id"));
                user = udao.getUserById(rs.getInt("user_id"));
                LocalDate dueDate = rs.getDate("due_date") != null ? rs.getDate("due_date").toLocalDate() : null;
                LocalDate createdAt = rs.getDate("created_at") != null ? rs.getDate("created_at").toLocalDate() : null;
                LocalDate updatedAt = rs.getDate("updated_at") != null ? rs.getDate("updated_at").toLocalDate() : null;
                task.setId(rs.getInt("id"));
                task.setUser(user);
                task.setTodolist(todo);
                task.setTitle(rs.getString("title"));
                task.setDescription(rs.getString("description"));
                task.setStatus(rs.getString("status"));
                task.setPriority(rs.getString("priority"));
                task.setDueDate(dueDate);
                task.setCreateAt(createdAt);
                task.setUpdateAt(updatedAt);
                
                list.add(task);
            
            }
        } catch (SQLException e) {
            e.getSQLState();
        }
        return list;
    }
    
    public int updateTask(String title, String description, String priority, String status, LocalDate updateAt,int id) {
        String sql = "UPDATE `tasks` SET `title`=?, `description`=?, `status`=?, `priority`=?, `updated_at`=? WHERE `id`=?";
        if (title == null || description == null || priority == null || status == null) {
            return 0;
        }
        int rowsAffected = 0;
        try (PreparedStatement st = con.prepareStatement(sql)){
            st.setString(1, title);
            st.setString(2, description);
            st.setString(3, status);
            st.setString(4, priority);
            st.setDate(5, java.sql.Date.valueOf(updateAt));
            st.setInt(6, id);
            rowsAffected = st.executeUpdate();
        } catch (SQLException e) {
       
        }
        return rowsAffected;

    }
    
    public int deleteTask(int id) {
        String sql = "DELETE FROM `tasks` WHERE `id`=?";
        int rowAffected = 0;
        try (PreparedStatement st = con.prepareStatement(sql)){
            st.setInt(1, id);
            rowAffected = st.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Error executing delete operation: " + e.getMessage()); // Log the error message
            e.printStackTrace(); // Print the stack trace for debugging
        }
        return rowAffected;
    }
    
    public void insertWithDefault(Task t) {
        String sql = "INSERT INTO `tasks` (`user_id`, `title`, `description`)  VALUES (?, ?, ?) WHERE `todolist_id`=? AND `user_id`=?";
        
        try (PreparedStatement st = con.prepareStatement(sql)){
            st.setInt(1, t.getUser().getId());
            st.setString(2, t.getTitle());
            st.setString(3, t.getDescription());
            st.setInt(4, t.getTodolist().getId());
            st.setInt(5, t.getUser().getId());
            st.executeUpdate();
            //
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public void insertWithFullData(Task t) {
        String sql = "INSERT INTO `tasks` (`user_id`, `todolist_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (PreparedStatement st = con.prepareStatement(sql)){
            st.setInt(1, t.getUser().getId());
            st.setInt(2, t.getTodolist().getId());
            st.setString(3, t.getTitle());
            st.setString(4, t.getDescription());
            st.setString(5, t.getStatus());
            st.setString(6, t.getPriority());
                
            // Chuyển đổi LocalDate -> java.sql.Date
            st.setDate(7, java.sql.Date.valueOf(t.getDueDate()));
            st.setDate(8, java.sql.Date.valueOf(t.getCreateAt()));
            st.setDate(9, java.sql.Date.valueOf(t.getUpdateAt()));
            
            st.executeUpdate();
            //
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
    }
    
    public Task getTaskById(int id) {
        String sql = "SELECT * FROM `tasks` WHERE `id`=?";
        Task task = new Task();
        UserDAO udao = new UserDAO();
        User user;
        Todolist todo;
        TodolistDAO tododao = new TodolistDAO();
        try (PreparedStatement st = con.prepareStatement(sql)) {
            st.setInt(1, id);
            ResultSet rs = st.executeQuery();
            if(rs.next()) {
                todo = tododao.getTodolistById(rs.getInt("todolist_id"));
                user = udao.getUserById(rs.getInt("user_id"));
                LocalDate dueDate = rs.getDate("due_date") != null ? rs.getDate("due_date").toLocalDate() : null;
                LocalDate createdAt = rs.getDate("created_at") != null ? rs.getDate("created_at").toLocalDate() : null;
                LocalDate updatedAt = rs.getDate("updated_at") != null ? rs.getDate("updated_at").toLocalDate() : null;
                task.setId(rs.getInt("id"));
                task.setUser(user);
                task.setTodolist(todo);
                task.setTitle(rs.getString("title"));
                task.setDescription(rs.getString("description"));
                task.setStatus(rs.getString("status"));
                task.setPriority(rs.getString("priority"));
                task.setDueDate(dueDate);
                task.setCreateAt(createdAt);
                task.setUpdateAt(updatedAt);
                
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return task;
    }
    
    public List<Task> getTasksByTodoIdAndUserId(int userId, int todoId) {
        String sql = "SELECT * FROM `tasks` WHERE `user_id`=? AND `todolist_id`=?";
        Task task;
        List<Task> list = new ArrayList<>();
        User user;
        UserDAO udao = new UserDAO();
        TodolistDAO tododao = new TodolistDAO();
        Todolist todo;
        try (PreparedStatement st = con.prepareStatement(sql)){
            st.setInt(1, userId);
            st.setInt(2, todoId);
            ResultSet rs = st.executeQuery();
            while(rs.next()) {
                task = new Task();
                todo = tododao.getTodolistById(rs.getInt("todolist_id"));
                user = udao.getUserById(rs.getInt("user_id"));
                LocalDate dueDate = rs.getDate("due_date") != null ? rs.getDate("due_date").toLocalDate() : null;
                LocalDate createdAt = rs.getDate("created_at") != null ? rs.getDate("created_at").toLocalDate() : null;
                LocalDate updatedAt = rs.getDate("updated_at") != null ? rs.getDate("updated_at").toLocalDate() : null;
                task.setId(rs.getInt("id"));
                task.setUser(user);
                task.setTodolist(todo);
                task.setTitle(rs.getString("title"));
                task.setDescription(rs.getString("description"));
                task.setStatus(rs.getString("status"));
                task.setPriority(rs.getString("priority"));
                task.setDueDate(dueDate);
                task.setCreateAt(createdAt);
                task.setUpdateAt(updatedAt);
                list.add(task);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
}
