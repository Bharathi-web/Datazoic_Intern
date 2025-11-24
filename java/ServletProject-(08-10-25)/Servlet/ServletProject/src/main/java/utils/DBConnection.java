package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

		    private static final String DB_URL = "jdbc:sqlserver:// 192.168.3.125 : 1433;database= SQLTraining";
		    private static final String DB_USER = "DzTrainee";
		    private static final String DB_PASSWORD = "Sql!2025";
		    private static Connection connection = null;

		    // Private constructor to prevent instantiation
		    private DBConnection() {
		    }

		    public static Connection getConnection() throws SQLException {
		        if (connection == null || connection.isClosed()) {
		            try {
		                Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
		                connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
		            } catch (ClassNotFoundException e) {
		                System.err.println("JDBC Driver not found: " + e.getMessage());
		                throw new SQLException("JDBC Driver not found.", e);
		            }
		        }
		        return connection;
		    }

		    public static void closeConnection(Connection conn) {
		        if (conn != null) {
		            try {
		                conn.close();
		            } catch (SQLException e) {
		                System.err.println("Error closing connection: " + e.getMessage());
		            }
		        }
		    }
		}



