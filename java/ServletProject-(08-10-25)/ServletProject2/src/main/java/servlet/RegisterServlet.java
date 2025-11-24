package servlet;
 
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
 
import utils.DBConnection;
 
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String fullname = request.getParameter("fullname");
        String phonenumber = request.getParameter("phonenumber");
        String email = request.getParameter("email");
 
        // Basic server-side validation for required fields
        if (username == null || username.trim().isEmpty() ||
            password == null || password.trim().isEmpty() ||
            fullname == null || fullname.trim().isEmpty() ||
            email == null || email.trim().isEmpty()) {
            request.setAttribute("message", "Please fill all fields.");
            request.getRequestDispatcher("register.html").forward(request, response);
            return;
        }
 
        try (Connection con = DBConnection.getConnection()) {
            // Check existing username
            try (PreparedStatement psCheck = con.prepareStatement("SELECT COUNT(*) FROM Form.Users WHERE username = ?")) {
                psCheck.setString(1, username);
                try (ResultSet rs = psCheck.executeQuery()) {
                    if (rs.next() && rs.getInt(1) > 0) {
                        request.setAttribute("message", "Username already exists! Try another one.");
                        request.getRequestDispatcher("register.html").forward(request, response);
                        return;
                    }
                }
            }
 
            // Insert new user into DB
            String insertSql = "INSERT INTO Form.Users (username, password, fullname, phonenumber, email) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement ps = con.prepareStatement(insertSql)) {
                ps.setString(1, username);
                ps.setString(2, password);
                ps.setString(3, fullname);
                ps.setString(4, phonenumber != null ? phonenumber : "");
                ps.setString(5, email);
                int rows = ps.executeUpdate();
                if (rows > 0) {
                    response.sendRedirect("login.html?msg=registered");
                } else {
                    request.setAttribute("message", "Registration failed.");
                    PrintWriter out = response.getWriter();
                    out.println("<center>Registration failed</center>");
                    request.getRequestDispatcher("register.html").forward(request, response);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            request.setAttribute("message", "Internal error: " + e.getMessage());
            request.getRequestDispatcher("error.jsp").forward(request, response);
        }
    }
}