<%-- Document : signup Created on : Feb 2, 2025, 3:30:58 PM Author : Admin --%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup Page</title>
    <!-- reset css -->
    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/reset.css" />
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />

    <link rel="stylesheet" href="<%= request.getContextPath() %>/assets/css/login.css" />

    <!-- Fontawesome -->
    <script
      src="https://kit.fontawesome.com/0d08ec65dc.js"
      crossorigin="anonymous"
    ></script>
  </head>
  <body>
    <div class="container">
      <form action="signup" class="login-form" method="post" id="form-signup">
        <h1 class="header">Join our task</h1>
        <p class="desc">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
          impedit.
        </p>

        <div class="form-group ${(requestScope.invalid != null) ? "invalid" : ""}">
          <input
            type="text"
            class="input-form"
            placeholder="Username"
            id="username"
            name="username"
            autocomplete="off"
          />
          <span class="form-message">${requestScope.invalid}</span>
        </div>
        <div class="form-group">
          <input
            type="email"
            class="input-form"
            placeholder="Email"
            id="email"
            name="email"
            autocomplete="off"
          />
          <span class="form-message"></span>
        </div>
        <div class="form-group">
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
          <button class="signup-page signup-btn">Signup</button>
          <a href="login" class="backto-login">Back to login</a>
        </div>
      </form>
    </div>
    <script src="${pageContext.request.contextPath}/js/validator.js"></script>
    <script>
      Validator({
        form: "#form-signup",
        formGroupSelector: ".form-group",
        formMessage: ".form-message",
        rules: [
          Validator.isRequired("#username"),
          Validator.isRequired("#password"),
          Validator.minLength("#password", 6, "Please do not empty this field"),
          Validator.isRequired("#email"),
          Validator.isEmail("#email"),
        ],
      });
      const invalid = document.querySelector(".invalid");
      const formGroup = document.querySelector(".form-group");
      if (invalid) {
        formGroup.onclick = function (e) {
          const btn = e.target.closest(".btn");
          btn.preventDefault();
          btn.stopPropagation();
        };
      }
    </script>
  </body>
</html>
