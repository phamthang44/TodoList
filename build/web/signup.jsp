<%-- 
    Document   : signup
    Created on : Feb 2, 2025, 3:30:58 PM
    Author     : Admin
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup Page</title>
    <!-- reset css -->
    <link rel="stylesheet" href="./assets/css/reset.css" />
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />

    <link rel="stylesheet" href="./assets/css/login.css" />

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
    <div class="container">
      <form action="login" class="login-form" method="post">
        <h1 class="header">Join our task</h1>
        <p class="desc">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
          impedit.
        </p>

        <div class="form-group">
          <input
            type="text"
            class="input-form"
            placeholder="Username"
            required
          />
          <p class="error-msg">must have valid username</p>
        </div>
        <div class="form-group">
          <input type="email" class="input-form" placeholder="Email" required />
          <p class="error-msg"></p>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="input-form"
            placeholder="Password"
            required
          />
          <p class="error-msg"></p>
        </div>
        <div class="form-group">
          <button class="btn">Login</button>
        </div>
      </form>
    </div>
  </body>
</html>