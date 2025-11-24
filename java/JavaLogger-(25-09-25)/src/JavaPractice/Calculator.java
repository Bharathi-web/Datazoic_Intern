package JavaPractice;

import java.util.Scanner;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

class Cal {
	double num1, num2;

	Cal(double num1, double num2) {
		this.num1 = num1;
		this.num2 = num2;
	}

	double calculate() {
		return 0;
	}
}

class Add extends Cal {

	Add(double num1, double num2) {
		super(num1, num2);
	}

	double calculate() {
		return num1 + num2;
	}
}

class Sub extends Cal {

	Sub(double num1, double num2) {
		super(num1, num2);
	}

	double calculate() {
		return num1 - num2;
	}
}

class Mul extends Cal {
	Mul(double num1, double num2) {
		super(num1, num2);
	}

	double calculate() {
		return num1 * num2;
	}
}

class Div extends Cal {
	Div(double num1, double num2) {
		super(num1, num2);
	}

	double calculate() {
		if (num2 == 0) {
			System.out.println("Cannot divide by zero");
			return num1;
		}
		return num1 / num2;
	}
}

public class Calculator {
	private static final Logger logger = LogManager.getLogger(Main.class);
	 
	public static void main(String[] args) {
		DOMConfigurator.configure("log4j.xml");
		Scanner sc = new Scanner(System.in);
		double result = 0;
		boolean firstInput = true;

		System.out.println("----------Simple Calculator-----------");

		while (true) {
			double number;
			
			if (firstInput) {
				try {
				System.out.print("Enter number: ");
				result = sc.nextDouble();
				if(Character.isDigit((char) result)) 
					continue;
				}
				catch(Exception e) {
					logger.warn(e+"  Invalid Input! Try again...  ");
					break;
				}
				firstInput = false;
			}
			

			logger.info("Enter operator (+, -, *, /, =): ");
			String operation = sc.next();

			if (operation.equals("=")) {
				logger.info("Final Result = " + result);
				break;
			}

			System.out.print("Enter number: ");
			number = sc.nextDouble();

			Cal calc = null;
			switch (operation) {
			case "+":
				calc = new Add(result, number);
				break;
			case "-":
				calc = new Sub(result, number);
				break;
			case "*":
				calc = new Mul(result, number);
				break;
			case "/":
				calc = new Div(result, number);
				break;
			default:
				System.out.println("Invalid operator! Try again.");
				continue;
			}

			result = calc.calculate();
			logger.info("result"+result);
		}

		sc.close();
	}

	
}