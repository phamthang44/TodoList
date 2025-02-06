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
    private int user_id; 
    private String name;
    private List<Task> tasks; // Danh sách task thuộc dự án này

    // Constructor không có tham số
    public Todolist() {}

    // Constructor có tham số
    public Todolist(int id, int user_id, String name) {
        this.id = id;
        this.user_id = user_id;
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
        return user_id;
    }

    public void setUserId(int user_id) {
        this.user_id = user_id;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
