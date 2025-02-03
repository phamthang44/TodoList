/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Task;
import model.Task.Priority;
import model.Task.Status;
import model.User;

public class TaskDAO extends DatabaseConnection {
    
    public List<Task> getAllTasks() {
        List<Task> tasks = new ArrayList<>();
        String sql = "SELECT * FROM tasks;";
        UserDAO udao = new UserDAO();
        try (PreparedStatement st = con.prepareStatement(sql);
             ResultSet rs = st.executeQuery()) {
            
            while (rs.next()) {
                // Chuyển đổi dữ liệu
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String description = rs.getString("description");
                Status status = Status.valueOf(rs.getString("status"));
                Priority priority = Priority.valueOf(rs.getString("priority"));
                LocalDateTime dueDate = rs.getTimestamp("due_date") != null ? rs.getTimestamp("due_date").toLocalDateTime() : null;
                LocalDateTime createAt = rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null;
                LocalDateTime updateAt = rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null;
                int userId = rs.getInt("user_id");
                
                // Lấy đối tượng User (phương thức để lấy User từ userId)
                User user = udao.getUserById(userId);
                
                // Khởi tạo đối tượng Task
                Task task = new Task(id, title, description, status, priority, dueDate, createAt, updateAt, user);
                tasks.add(task);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return tasks;
    }
    
}
