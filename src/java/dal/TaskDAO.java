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
}
