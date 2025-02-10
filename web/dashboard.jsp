<%-- 
    Document   : dashboard
    Created on : Feb 8, 2025, 9:47:28 AM
    Author     : Admin
--%>

<%@page import="model.User"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Dash board</title>
    </head>
    <body>
        <%
            User user = (User) session.getAttribute("account");
        %>

        <h1>Welcome back <%= user.getUsername()%></h1>

        <!-- Form thêm mới TodoList -->
        <form action="addnewtodolist" method="post">
            <input type="text" name="name" placeholder="Enter TodoList name" required>
            <button type="submit">Add new TodoList</button>
        </form>

        <table border="1">
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User ID</th>
                <th>Actions</th>
            </tr>
            <c:forEach var="todo" items="${sessionScope.todoList}">
                <tr>
                    <td>${todo.id}</td>
                    <td>${todo.name}</td>
                    <td>${todo.userId}</td>
                    <td><a href="home?todolist_id=${todo.id}">Click here to watch more details</a></td>
                </tr>
            </c:forEach>
        </table>    
    </body>
</html>
