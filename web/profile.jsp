<%@page import="model.User"%> <%@page contentType="text/html"
pageEncoding="UTF-8"%> <%@taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="en">
  <head>
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
    <title>Profile page</title>
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
                <a href="#">
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
        <div class="container-profile">
          <h1 class="header-profile">Edit Profile</h1>
          <div class="block-profile">
            <div class="block-profile__inside">
              <div class="block-profile__summary-details">
                <div class="block-profile__summary-details__user-img">
                  <div class="block-image">
                    <img src="./assets/images/user.jpg" alt="user image" />
                  </div>
                  <span class="user-name">test</span>
                </div>
                <div class="block-profile__summary-details__summary-info">
                  <div class="summary-details__status">
                    <div class="square"><span class="number">10</span></div>
                    <span class="status-text">To Start</span>
                  </div>
                  <div class="summary-details__status">
                    <div class="square"><span class="number">10</span></div>
                    <span class="status-text">In Progress</span>
                  </div>
                  <div class="summary-details__status">
                    <div class="square"><span class="number">10</span></div>
                    <span class="status-text">Completed</span>
                  </div>
                </div>
                <button class="edit-btn">
                  <i class="fa-regular fa-pen-to-square"></i>
                </button>
              </div>
              <div class="block-profile__spacer"></div>
              <div class="block-profile__user-details">
                <div class="info-group">
                  <i class="fa-regular fa-user"></i>
                  <p class="title">Name</p>
                  <span class="text"><%= user.getUsername()%></span>
                </div>
                <div class="info-group">
                  <i class="fa-regular fa-envelope"></i>
                  <p class="title">Email</p>
                  <span class="text"><%= user.getEmail()%></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <script src="./js/script.js"></script>
  </body>
</html>
