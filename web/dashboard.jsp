<%-- 
    Document   : dashboard
    Created on : Feb 8, 2025, 9:47:28 AM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Dash board</title>
    </head>
    <body>
        <h1>Hello World!</h1>

        <table border="1">
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>User ID</th>
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
