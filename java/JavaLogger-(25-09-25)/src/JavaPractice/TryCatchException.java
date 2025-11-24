package JavaPractice;

import java.util.InputMismatchException;
import java.util.Scanner;

import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

public class TryCatchException {
	private static final Logger logger = LogManager.getLogger(TryCatchException.class);

	public static void main(String[] args) {
		DOMConfigurator.configure("log4j.xml");
		try {
			int[] arr = new int[5];
			Scanner sc = new Scanner(System.in);
			System.out.println("Enter the array values: ");
			for (int num : arr) {
				num = sc.nextInt();
			}
			arr[5] = 9;
			sc.close();
		} catch (ArrayIndexOutOfBoundsException e) {
			 logger.error("This is an ERROR message.");
			//System.out.println("Retry.......\n " + e);
		} catch (InputMismatchException e) {
			//System.out.println("Invalid input. Retry\n " + e);
			logger.error("This is an ERROR message."+e);
			

		}

		//System.out.println("Execution completed");
		
	}

}
