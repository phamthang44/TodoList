<%-- Document : home Created on : Feb 2, 2025, 3:34:06 PM Author : Admin --%>
<%@page import="model.Todolist"%> 
<%@page import="dal.TodolistDAO"%> 
<%@page import="model.Task"%> 
<%@page import="java.util.List"%>
<%@page import="model.User"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
    <head>
        <title>Todo list</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- reset css -->
        <link rel="stylesheet" href="./assets/css/reset.css" />
        <!-- Font -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
            />

        <link rel="stylesheet" href="./assets/css/styles.css" />

        <!-- Fontawesome -->
        <script
            src="https://kit.fontawesome.com/0d08ec65dc.js"
            crossorigin="anonymous"
        ></script>
        <!-- jQuery phiên bản mới nhất (3.x) -->
        <script
            src="https://code.jquery.com/jquery-3.7.1.min.js"
            integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
            crossorigin="anonymous"
        ></script>
    </head>
    <body>
        <% User user = (User) session.getAttribute("account");%>
        <div class="container">
            <div class="sidebar">
                <div class="menu-btn">
                    <i class="fa-solid fa-arrow-left"></i>
                </div>
                <div class="head">
                    <div class="user-img">
                        <img src="./assets/images/user.jpg" alt="nothing" />
                    </div>
                    <div class="user-details">
                        <p class="title">Web Developer</p>
                        <p class="name"><%= user.getUsername()%></p>
                    </div>
                </div>
                <div class="nav">
                    <div class="menu">
                        <p class="title">Main</p>
                        <ul>
                            <li>
                                <a href="dashboard">
                                    <i class="icon fa-solid fa-house"></i>
                                    <span class="text">Dash board</span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="icon fa-solid fa-list-check"></i>
                                    <span class="text">Tasks</span>
                                    <i class="arrow fa-solid fa-arrow-down"></i>
                                </a>
                                <ul class="sub-menu">
                                    <li>
                                        <a href="#">
                                            <span class="text">To start</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span class="text">In progress</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span class="text">Done</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="menu">
                        <p class="title">Settings</p>
                        <ul>
                            <li>
                                <a href="#">
                                    <i class="icon fa-solid fa-gear"></i>
                                    <span class="text">Settings</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="menu">
                    <p class="title">Account</p>
                    <ul>
                        <li>
                            <a href="#">
                                <i class="icon fa-solid fa-user"></i>
                                <span class="text">Profile</span>
                            </a>
                        </li>
                        <li>
                            <a href="logout">
                                <i class="icon fa-solid fa-arrow-right-from-bracket"></i>
                                <span class="text">Log out</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <i class="fa-regular fa-circle-question"></i>
                                <span class="text">Help</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <main>
                <div class="main">
                    <div class="block-adjust">
                        <div class="header">
                            Dash board &nbsp;&nbsp; > &nbsp;&nbsp; Tasks List
                        </div>
                        <div class="horizontal-line"></div>
                        <div class="body-dashboard">
                            <div class="box">
                                <% Todolist todo = (Todolist) session.getAttribute("todoList");
                    if (todo != null) {%>
                                <h1 class="title"><%= todo.getName()%></h1>
                                <% } else { %>
                                <h1 class="title">No todo found</h1>
                                <% }%>
                                <div class="combo-user">
                                    <a
                                        href="addnewtask?todolist_id=<%=todo.getId()%>"
                                        class="add-btn"
                                        >
                                        <i class="add fa-solid fa-plus"></i>
                                        <span class="text">New Task</span>
                                    </a>
                                    <div class="user-img">
                                        <img src="./assets/images/user.jpg" alt="user" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="search-area">
                            <div class="search-box">
                                <input
                                    type="text"
                                    class="input area__searchinput"
                                    placeholder="Search"
                                    id="search_input"
                                    />
                                <label for="search_input"
                                       ><i class="fa-solid fa-magnifying-glass"></i
                                    ></label>
                            </div>
                            <div class="date-filter">
                                <div class="date-container">
                                    <label>From</label>
                                    <input
                                        type="date"
                                        class="input input-date  from-date"
                                        id="datePicker"
                                        placeholder="From"
                                        />
                                    <i class="fa-solid fa-calendar date-icon"></i>
                                    <!-- Icon lịch -->
                                </div>
                                <div class="date-container">
                                    <label>To</label>
                                    <input
                                        type="date"
                                        class="input input-date to-date"
                                        id="datePicker"
                                        placeholder="To"
                                        />
                                    <i class="fa-solid fa-calendar date-icon"></i>
                                    <!-- Icon lịch -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="block__dashboardshow">
                        <div class="block__tostart">
                            <p class="state">To start</p>
                            <ul class="block__tostart tasks"></ul>
                        </div>
                        <div class="block__inprogress">
                            <p class="state">In progress</p>
                            <ul class="block__inprogress tasks"></ul>
                        </div>
                        <div class="block__done">
                            <p class="state">Done</p>
                            <ul class="block__done tasks"></ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
        <script src="./js/validator.js"></script>
        <script>
        var todolistId = <%= (todo != null) ? todo.getId() : -1%>;
        var contextPath = "<%= request.getContextPath()%>";
        console.log(todolistId);
        console.log(contextPath);
//        Validator({
//            form: "#updateTask",
//            formMessage: ".form-message",
//            rules: [
//                Validator.isRequired("#taskTitle"),
//                Validator.isRequired("#taskDescription"),
//            ],
//        });
        </script>
        <script type="module" src="./js/script.js"></script>
    </body>
</html>
