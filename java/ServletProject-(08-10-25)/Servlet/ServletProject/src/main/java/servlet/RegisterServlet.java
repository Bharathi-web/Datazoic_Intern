package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import utils.DBConnection;

/**
 * Servlet implementation class RegisterServlet
 */
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
//	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//		// TODO Auto-generated method stub
//		response.getWriter().append("Served at: ").append(request.getContextPath());
//	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	 
	        String username = request.getParameter("username");
	        String password = request.getParameter("password");
	        String fullname = request.getParameter("fullname");
	 
	        try (Connection con = DBConnection.getConnection()) {
	            // Check if username exists
	            PreparedStatement psCheck = con.prepareStatement("SELECT * FROM Form.Users WHERE username = ?");
	            psCheck.setString(1, username);
	            ResultSet rs = psCheck.executeQuery();
	 
	            if (rs.next()) {
	                request.setAttribute("message", "Username already exists! Try another one.");
	                request.getRequestDispatcher("register.html").forward(request, response);
	            } else {
	                // Insert new user
	                PreparedStatement ps = con.prepareStatement("INSERT INTO Form.Users (username, password, fullname) VALUES (?, ?, ?)");
	                ps.setString(1, username);
	                ps.setString(2, password);
	                ps.setString(3, fullname);
	                ps.executeUpdate();
	 
	                response.sendRedirect("login.html?msg=registered");
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	            response.sendRedirect("error.jsp");
	        }
	   
	}

}
