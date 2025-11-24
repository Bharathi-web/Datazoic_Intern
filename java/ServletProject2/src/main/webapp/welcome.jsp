<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%
    HttpSession h = request.getSession(false);
    if (h == null || session.getAttribute("username") == null) {
        response.sendRedirect("login.html");
        return;
    }
    String name = (String) session.getAttribute("fullname");
    String user = (String) session.getAttribute("username");
    if (user == null) {
        response.sendRedirect("login.html");
        return;
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="ISO-8859-1">
    <title>Welcome</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body>
    <div class="min-h-screen bg-cover bg-center flex items-center justify-center" style="background-image: url('https://picsum.photos/1920/1080')">
        <div class="bg-white p-8 rounded shadow-md text-center max-w-md w-full mx-4">
            <h2 class="text-3xl font-bold mb-6">
                Welcome, <%= (name != null && !name.isEmpty()) ? name : user %>
            </h2>
            <hr class="my-4">
            <p class="text-gray-600 mb-8">You have successfully logged in to your account.</p>
            <a
                href="LogoutServlet"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
            >
                Logout
            </a>
        </div>
    </div>
</body>
</html>