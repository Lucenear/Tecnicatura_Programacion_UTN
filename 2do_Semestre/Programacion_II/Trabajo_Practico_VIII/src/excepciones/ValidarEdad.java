package excepciones;

import java.util.Scanner;

public class ValidarEdad {
    public static void ejecutar(Scanner scanner) {
        System.out.print("Ingresa tu edad: ");
        int edad = scanner.nextInt();
        scanner.nextLine(); // Consumir el salto de linea

        try {
            if (edad < 0 || edad > 120) {
                throw new EdadInvalidaException("La edad debe estar entre 0 y 120.");
            }
            System.out.println("Edad valida: " + edad);
        } catch (EdadInvalidaException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}