package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

//		    private static final String DB_URL = "jdbc:sqlserver://192.168.3.125:1433;database= SQLTraining";
//		    private static final String DB_USER = "DzTrainee";
//		    private static final String DB_PASSWORD = "Sql!2025";
		    private static Connection connection = null;

		    public static void main(String[] args) {
	        	getConnection();
	        }
		    public static Connection getConnection(){
		    	Connection connection=null;
		    	try {
		    		String url=UtilityClass.getProperty("db.url");
		    		System.out.println(url);
		    		String username=UtilityClass.getProperty("db.username");
		    		System.out.println(username);
		    		String password=UtilityClass.getProperty("db.password");
		    		System.out.println(password);
		    		String driver=UtilityClass.getProperty("db.driver");
		    		System.out.println(driver);
		    		 if (url == null || username == null || password == null || driver == null) {
		                throw new SQLException("Database connection properties are missing.");
		            }
		    		Class.forName(driver);
		    		connection=DriverManager.getConnection(url,username,password);
		    		System.out.println("Connection Successfull");		
		    	}
		       catch(Exception e){
		    	   System.out.println("DBconnection failed");
		    	   e.printStackTrace();
		       }
		        return connection;
		    }
		}



