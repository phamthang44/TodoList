<%@page contentType="text/html" pageEncoding="UTF-8"%> 
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Page</title>
    <!-- reset css -->
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/reset.css" />
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />

    <link
      rel="stylesheet"
      href="<%= request.getContextPath() %>/assets/css/login.css"
    />

    <!-- Fontawesome -->
    <script
      src="https://kit.fontawesome.com/0d08ec65dc.js"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <div class="container">
      <form
        action="login"
        class="login-form"
        method="post"
        id="form-login"
        onSubmit=""
      >
        <h1 class="header">Welcome back</h1>
        <div class="form-group ${(requestScope.invalid != null) ? "invalid" : ""}">
          <input
            type="text"
            class="input-form"
            placeholder="Username"
            name="username"
            id="username"
            autocomplete="off"
          />
          <span class="form-message"></span>
        </div>

        <div class="form-group ${(requestScope.invalid != null) ? "invalid" : ""}">
          <input
            type="password"
            class="input-form"
            placeholder="Password"
            name="password"
            id="password"
            autocomplete="off"
          />
          <span class="form-message"></span>
        </div>
        <div class="form-group">
          <button class="btn">Login</button>
        </div>
        <div class="form-group">
          <input
            type="checkbox"
            name="remember"
            class="remember"
            value="yes"
            id="remember-me"
          />
          <label for="remember-me">Remember me?</label>
          <a href="signup" class="signup-btn">Or Sign up Here</a>
        </div>
      </form>
    </div>
    <script src="${pageContext.request.contextPath}/js/validator.js"></script>
    <script>
      let invalidMsg = "${(requestScope.invalid != null) ? "The username or password is not correct" : ""}";
      const formMsg = document.querySelectorAll(".form-message");
      if (invalidMsg) {
          formMsg.forEach((msg) => {
              msg.textContent = invalidMsg;
          });
          
      }
      Validator({
        form: "#form-login",
        formGroupSelector: ".form-group",
        formMessage: ".form-message",
        rules: [
          Validator.isRequired("#username"),
          Validator.isRequired("#password"),
          Validator.minLength("#password", 6, "Please input this field"),
        ],
      });
      const invalid = document.querySelector(".invalid");
      const formGroup = document.querySelector(".form-group");
      if (invalid) {
        formGroup.onclick = function (e) {
          const btn = e.target.closest(".btn");
          btn.preventDefault();
          btn.stopPropagation();
          btn.disabled = true;
        };
      }
    </script>
  </body>
</html>
