package excepciones;

import java.util.Scanner;

public class ConversionNumero {
    public static void ejecutar(Scanner scanner) {
        System.out.print("Ingresa un numero entero: ");
        String entrada = scanner.nextLine(); // Ahora funciona

        try {
            int numero = Integer.parseInt(entrada);
            System.out.println("Numero convertido: " + numero);
        } catch (NumberFormatException e) {
            System.out.println("Error: La entrada no es un numero valido.");
        }
    }
}