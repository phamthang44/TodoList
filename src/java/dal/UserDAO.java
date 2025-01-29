/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.User;

/**
 *
 * @author Admin
 */
public class UserDAO extends DatabaseConnection {

    public User check(String username, String password) {
        String sql = "SELECT * FROM Users WHERE Username=? AND Password=?";

        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                // Tạo đối tượng User từ dữ liệu trong ResultSet
                User user = new User();
                user.setId(rs.getInt("id")); // Lấy ID từ cơ sở dữ liệu
                user.setUsername(rs.getString("username")); // Lấy Username
                user.setEmail(rs.getString("email")); // Lấy Email
                user.setPassword(rs.getString("password")); // Lấy Password
                user.setCreateAt(rs.getTimestamp("created_at").toLocalDateTime()); // Lấy created_at và chuyển đổi thành LocalDateTime

                return user; // Trả về đối tượng User
            }
        } catch (SQLException e) {
            System.out.println(e);
        }

        return null;
    }
}
