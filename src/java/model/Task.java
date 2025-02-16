package model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;



public class Task {

    private int id;
    private User user; // Liên kết với User
    
    @JsonIgnoreProperties
    private Todolist todolist; // Liên kết với Todolist
    private String title;
    private String description;
    private String status;
    private String priority;
    private LocalDate dueDate; // Sử dụng LocalDate cho ngày (chỉ ngày, không có thời gian)
    private LocalDate createAt; // 
    private LocalDate updateAt; // 


    // Constructor mặc định
    public Task() {}

    // Constructor đầy đủ
    public Task(int id, User user, Todolist todolist, String title, String description,
                String status, String priority, LocalDate dueDate, LocalDate createAt, LocalDate updateAt) {
        this.id = id;
        this.user = user;
        this.todolist = todolist;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    // Getter và Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Todolist getTodolist() {
        return todolist;
    }

    public void setTodolist(Todolist todolist) {
        this.todolist = todolist;
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
