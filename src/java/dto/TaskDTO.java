/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dto;

import java.time.LocalDate;
import model.Todolist;
import model.User;

/**
 *
 * @author Admin
 */
public class TaskDTO {
    private int id;
    private int userId; // Liên kết với User

    private int todolistId; // Liên kết với Todolist
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate; // Sử dụng LocalDate cho ngày (chỉ ngày, không có thời gian)
    private LocalDate createAt; // 
    private LocalDate updateAt; // 

    public TaskDTO() {
    }

    public TaskDTO(int id, int userId, int todolistId, String title, String description, String status, String priority, LocalDate dueDate, LocalDate createAt, LocalDate updateAt) {
        this.id = id;
        this.userId = userId;
        this.todolistId = todolistId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getTodolistId() {
        return todolistId;
    }

    public void setTodolistId(int todolistId) {
        this.todolistId = todolistId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDate createAt) {
        this.createAt = createAt;
    }

    public LocalDate getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDate updateAt) {
        this.updateAt = updateAt;
    }
    
}
