$(document).ready(function() {
  $("#loginForm").submit(function(e) {
    e.preventDefault();

    let username = $("#username").val();
    let password = $("#password").val();

    //validation
    if(username === "admin" && password === "1234") {
      let expirySeconds =10; // 10 seconds
      let d = new Date();
      d.setTime(d.getTime() + (expirySeconds * 1000));
      document.cookie = `username=${username};expires=${d.toUTCString()};path=/`;

      window.location.href = "../Form/form.html";
    } else {
      alert("Invalid credentials");
    }
  });
});

