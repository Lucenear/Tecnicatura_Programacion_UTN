package trabajo_practico_i;

/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

import java.util.Scanner;

public class Consigna_4 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Ingresa tu nombre: ");
        String nombre = scanner.nextLine();

        System.out.print("Ingresa tu edad: ");
        int edad = Integer.parseInt(scanner.nextLine());

        System.out.println("\nNombre: " + nombre);
        System.out.println("Edad: " + edad);
    }
}