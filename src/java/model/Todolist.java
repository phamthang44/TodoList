/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;


/**
 *
 * @author Admin
 */
import java.util.List;

public class Todolist {
    private int id;
    private int userId; 
    private String name;
    private List<Task> tasks; // Danh sách task thuộc dự án này

    // Constructor không có tham số
    public Todolist() {}

    // Constructor có tham số
    public Todolist(int id, int userId, String name) {
        this.id = id;
        this.userId = userId;
        this.name = name;
    }

    // Getter và Setter

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public List<Task> getTasks() {
        return tasks;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
