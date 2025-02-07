/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import java.util.UUID;
/**
 *
 * @author Admin
 */

public class LoginServlet extends HttpServlet {

    
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet Login</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Login at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password= request.getParameter("password");
        //cần thêm validate phòng trường hợp nó ném sql vào hoặc kí tự không phù hợp
        // ....
        //.........
        //
        String rem = request.getParameter("remember");
        UserDAO udao = new UserDAO();
        User user = udao.checkUser(username, password);
        
        if (user != null) {
            //giờ viết logic ném username, id sang bên trang home.jsp để bên đó nhận id
            HttpSession session = request.getSession();
            session.setAttribute("account", user);
            
            if (rem != null) {
                String token = UUID.randomUUID().toString(); //tạo token duy nhất
                Cookie cookie = new Cookie("rememberToken", token);
                cookie.setMaxAge(60 * 60 * 24 * 3); //lưu 3 ngày
                cookie.setHttpOnly(true);
                response.addCookie(cookie);
            }
            response.sendRedirect("home");
        } else {
            request.setAttribute("invalid", "Username or Password is invalid!");
            request.setAttribute("invalid2", "invalid");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
        
    }

   
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
