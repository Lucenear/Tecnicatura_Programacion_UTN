package excepciones;

import java.util.Scanner;

public class DivisionSegura {
    public static void ejecutar(Scanner scanner) {
        System.out.print("Ingresa el dividendo: ");
        double dividendo = scanner.nextDouble();
        System.out.print("Ingresa el divisor: ");
        double divisor = scanner.nextDouble();
        scanner.nextLine(); // Consumir el salto de linea restante

        try {
            double resultado = dividendo / divisor;
            System.out.println("Resultado: " + resultado);
        } catch (ArithmeticException e) {
            System.out.println("Error: No se puede dividir por cero.");
        }
    }
}