package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import utils.DBConnection;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 String username = request.getParameter("username");
	        String password = request.getParameter("password");
	 
	        try (Connection con = DBConnection.getConnection()) {
	            PreparedStatement ps = con.prepareStatement("SELECT fullname FROM Form.Users WHERE username = ? AND password = ?");
	            ps.setString(1, username);
	            ps.setString(2, password);
	 
	            try(ResultSet rs = ps.executeQuery()){
	 
	            if (rs.next()) {
	                // create session
	                HttpSession session = request.getSession();
	                if(session == null) {
	                	request.getSession(true);
	                	System.out.println("User exist");
	                	 session.setAttribute("username", username);
	                }
	               
	               
	               
	                session.setAttribute("fullname", rs.getString("fullname").trim());
	                response.setStatus(200);
	               //System.out.println("username "+session.getAttribute(username) );
	                response.sendRedirect("welcome.jsp");
	                System.out.println(username);
	                System.out.println(password);
	           
	            } else {
	                response.sendRedirect("login.html?error=invalid");
	            }}
	        } catch (SQLException e) {
	            e.printStackTrace();
	            response.sendRedirect("error.jsp");
	        }
	}

}
