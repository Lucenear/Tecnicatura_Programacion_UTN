package trabajo_practico_i;

import java.util.Scanner;

/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

public class Consigna_5 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Ingresa el primer numero entero: ");
        int num1 = Integer.parseInt(input.nextLine());

        System.out.print("Ingresa el segundo numero entero: ");
        int num2 = Integer.parseInt(input.nextLine());

        int suma = num1 + num2;
        int resta = num1 - num2;
        int multiplicacion = num1 * num2;
        double division = (double) num1 / num2;

        System.out.println("\nSuma: " + num1 + " + " + num2 + " = " + suma);
        System.out.println("Resta: " + num1 + " - " + num2 + " = " + resta);
        System.out.println("Multiplicacion: " + num1 + " * " + num2 + " = " + multiplicacion);
        System.out.println("Division: " + num1 + " / " + num2 + " = " + division);
    }
}