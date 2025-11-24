package JavaPractice;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

public class Main {
	private static final Logger logger = LogManager.getLogger(Main.class);
	 
    public static void main(String[] args) {
    	DOMConfigurator.configure("log4j.xml");
        logger.trace("This is a TRACE message.");
        logger.debug("This is a DEBUG message.");
        logger.info("This is an INFO message.");
        logger.warn("This is a WARN message.");
        logger.error("This is an ERROR message.");
        logger.fatal("This is a FATAL message.");

        System.out.println("Logging complete.");

    }

}
