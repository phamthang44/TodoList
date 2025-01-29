/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

/**
 *
 * @author Admin
 */
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection {

    protected Connection con;

    public DatabaseConnection() {
        try {
            // Initialize all the information regarding the Database Connection 
            String dbDriver = "com.mysql.cj.jdbc.Driver";  // Cập nhật tên driver
            String dbURL = "jdbc:mysql://localhost:3306/";
            // Database name to access 
            String dbName = "todo_app";
            String dbUsername = "root";
            String dbPassword = "phamthang20042005";

            // Thêm tham số serverTimezone để tránh lỗi timezone
            dbURL += dbName + "?serverTimezone=UTC";

            // Đăng ký driver
            Class.forName(dbDriver);

            // Kết nối cơ sở dữ liệu
            con = DriverManager.getConnection(dbURL, dbUsername, dbPassword);

        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace();
        }
    }

}
