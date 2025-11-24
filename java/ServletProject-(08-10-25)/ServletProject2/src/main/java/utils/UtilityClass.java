package utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class UtilityClass {
	     private static Properties properties=new Properties();
	     static{
	    	   try {
	    		 //  FileInputStream file=new FileInputStream("/ServletProject2/src/main/java/application.properties");
    		   java.io.InputStream files = UtilityClass.class.getClassLoader()
	                     .getResourceAsStream("application.properties");
	    		   properties.load(files);
	    	   }catch(IOException e) {
	    		   System.out.println("The File is Not found");
	    		   e.getStackTrace();
	    	   }
	     }

	 
	 
		public static String getProperty(String key) {
			return properties.getProperty(key);
		}
	}


