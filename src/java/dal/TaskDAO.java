/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Task;
import model.User;

public class TaskDAO extends DatabaseConnection {

    public List<Task> getTasksByTodolistAndUser(int todolistId, int userId) {
        List<Task> tasks = new ArrayList<>();
        String sql = "SELECT * FROM tasks WHERE todolist_id = ? AND user_id = ?";

        try (PreparedStatement statement = con.prepareStatement(sql)) {
            // Đặt các tham số vào câu lệnh SQL
            statement.setInt(1, todolistId);
            statement.setInt(2, userId);

            ResultSet resultSet = statement.executeQuery();

            // Duyệt qua kết quả và tạo đối tượng Task cho mỗi dòng dữ liệu
            while (resultSet.next()) {
                int id = resultSet.getInt("id");
                String title = resultSet.getString("title");
                String description = resultSet.getString("description");
                Status status = Status.valueOf(resultSet.getString("status"));
                Priority priority = Priority.valueOf(resultSet.getString("priority"));
                Date dueDate = resultSet.getDate("due_date");
                Timestamp createAt = resultSet.getTimestamp("created_at");
                Timestamp updateAt = resultSet.getTimestamp("updated_at");

                Task task = new Task(id, title, description, status, priority, dueDate.toLocalDate(), 
                        createAt.toLocalDateTime(), updateAt.toLocalDateTime(), userId);
                
                tasks.add(task);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return tasks;
    }

}
