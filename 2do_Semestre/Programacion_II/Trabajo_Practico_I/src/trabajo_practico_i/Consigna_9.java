package trabajo_practico_i;

/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

import java.util.Scanner;

public class Consigna_9 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Ingresa tu nombre: ");
        
        String nombre = scanner.nextLine();// ERROR
        
        System.out.println("Hola, " + nombre);
    }
}