/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;


import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import model.Todolist;


/**
 *
 * @author Admin
 */
public class TodolistDAO extends DatabaseConnection {
    public List<Todolist> getTodoListsByUserId(int userId) {
        List<Todolist> list = new ArrayList<>();
        String sql = "SELECT * FROM todolists WHERE user_id = ?";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, userId);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                // Tạo đối tượng User từ dữ liệu trong ResultSet   
                Todolist todolist = new Todolist(
                   rs.getInt("id"),
                   rs.getInt("user_id"),
                   rs.getString("name")
                );
                list.add(todolist);          
            }
            
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (list.isEmpty()) {
            System.out.println("No records found in Categories table.");
        }
        return list;
    }
    
    public List<Todolist> getTodolistsByName(String name) {
        String sql = "SELECT * FROM todolists WHERE name=?";
        Todolist todo = null;
        List<Todolist> list = new ArrayList<>();
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, name);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                todo = new Todolist();
                todo.setId(rs.getInt("id"));
                todo.setName(rs.getString("name"));
                todo.setUserId(rs.getInt("user_id"));
                list.add(todo);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        if (list.isEmpty()) {
            System.out.println("No records found in Categories table.");
        }
        return list;
    }
    
    public Todolist getTodolistById(int id) {
        String sql = "SELECT * FROM todolists WHERE id=?";
        Todolist todo = null;
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, id);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                todo = new Todolist();
                todo.setId(rs.getInt("id"));
                todo.setName(rs.getString("name"));
                todo.setUserId(rs.getInt("user_id"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return todo;
    }
    
    public void createTodolist(Todolist todo) {
        String sql = "INSERT INTO todolists (user_id, name) VALUES(?, ?)";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, todo.getUserId());
            st.setString(2, todo.getName());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public void deleteTodolist(int todo_id) {
        String sql = "DELETE FROM todolists WHERE id=?";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, todo_id);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public void updateTodolist(Todolist todolist) {
        String sql = "UPDATE todolists SET name = ? WHERE id = ?";
        try {
            int id = todolist.getId();
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, todolist.getName());
            st.setInt(2, id);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
