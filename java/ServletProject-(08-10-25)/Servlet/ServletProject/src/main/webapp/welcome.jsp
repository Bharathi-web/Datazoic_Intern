<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<% 
HttpSession h= request.getSession(false);
if(h==null || session.getAttribute("username")==null){
	response.sendRedirect("login.html");
	return;
}
String name = (String) session.getAttribute("fullname");
String user = (String) session.getAttribute("username");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>welcome</title>
</head>
<body>
<h2>Welcome, <%= (name != null && !name.isEmpty()) ? name : user %></h2>
<a href="logout">Logout</a>

</body>
</html>