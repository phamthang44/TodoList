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
import model.User;

/**
 *
 * @author Admin
 */
public class UserDAO extends DatabaseConnection {

    public User checkUser(String username, String password) {
        String sql = "SELECT * FROM Users WHERE Username=? AND Password=?";
        User user = null;
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                // Tạo đối tượng User từ dữ liệu trong ResultSet
                user = new User();
                user.setId(rs.getInt("id")); // Lấy ID từ cơ sở dữ liệu
                user.setUsername(rs.getString("username")); // Lấy Username
                user.setEmail(rs.getString("email")); // Lấy Email
                user.setPassword(rs.getString("password")); // Lấy Password

            }
        } catch (SQLException e) {
            System.out.println(e);
        }

        return user;
    }

    public int getLastInsertId() {
        String sql = "SELECT LAST_INSERT_ID();";
        try (PreparedStatement stmt = con.prepareStatement(sql); 
            ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    public User getUserById(int userId) {
        // phương thức lấy user bằng ID

        String sql = "SELECT * FROM users WHERE id = ?;";

        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, userId);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                // Tạo đối tượng User từ dữ liệu trong ResultSet
                User user = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password")
                );

                return user; // Trả về đối tượng User
            }
        } catch (SQLException e) {
            System.out.println(e);
        }

        return null;
    }

    public void createUser(User user) {
        String sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, user.getUsername());
            st.setString(2, user.getEmail());
            st.setString(3, user.getPassword());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    //hàm này sẽ được gọi bởi servlet update user trong 1 trang update thông tin
    //servlet đó sẽ tạo object User bằng việc nhận dữ liệu từ form chỉnh sửa
    //gọi UserDAO ném vào ( User ) tương tự hàm tạo
    public void updateUser(User user) {
        String sql = "UPDATE users SET username = ?, emai = ?, password = ? WHERE id = ?";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setString(1, user.getUsername());
            st.setString(2, user.getEmail());
            st.setString(3, user.getPassword());
            st.setInt(4, user.getId());
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteUser(int userId) {
        String sql = "DELETE FROM users WHERE id = ?";
        try {
            PreparedStatement st = con.prepareStatement(sql);
            st.setInt(1, userId);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public boolean isValidUsername(String username) {
        boolean flag = false;
        String[] invalid = {"admin", "ADMIN", "Admin", "aDmin", "adMin", "admIn", "admiN"};
        for (String string : invalid) {
            if(string.equalsIgnoreCase("admin")) {
                flag = true;
            }
        }
        return !("admin".equalsIgnoreCase(username) || flag);
    } //!(false) -> true ngược lại !(true) -> false

    public List<User> checkAndValidateUser(String email, String username) {
        String sql = "SELECT * FROM users WHERE email=? AND username=?";
        List<User> existedEmailUsers = new ArrayList<>();
        boolean flag = isValidUsername(username);
        if (flag) {
            try {
                PreparedStatement st = con.prepareStatement(sql);
                st.setString(1, email);
                st.setString(2, username);
                ResultSet rs = st.executeQuery();
                User user;
                while (rs.next()) {
                    user = new User(
                            rs.getInt("id"),
                            rs.getString("username"),
                            rs.getString("email"),
                            rs.getString("password")
                    );
                    existedEmailUsers.add(user);
                }

            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return existedEmailUsers;
    }
}
