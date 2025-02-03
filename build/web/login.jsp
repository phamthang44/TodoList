<%-- Document : login Created on : Feb 2, 2025, 3:30:30 PM Author : Admin --%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Page</title>
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
      <form action="login" class="login-form" method="post" id="form-login">
        <h1 class="header">Welcome back</h1>

        <div class="form-group">
          <input
            type="text"
            class="input-form"
            placeholder="Username"
            required
            name="username"
            id="username"
            autocomplete="off"
          />
          <span class="form-msg"></span>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="input-form"
            placeholder="Password"
            name="password"
            required
            id="password"
            autocomplete="off"
          />
          <span class="form-msg"></span>
        </div>
        <div class="form-group">
          <button class="btn">Login</button>
        </div>
      </form>
    </div>
    <script src="./js/validator.js"></script>
    <script>
      //mong muốn của ta
      Validator({
        form: "form-login",
        rules: [
          Validator.isRequired("#username"),
          Validator.isPassword("#password"),
        ],
      });
    </script>
  </body>
</html>
