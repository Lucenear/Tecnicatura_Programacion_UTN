package trabajo_practico_i;

/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

import java.util.Scanner;

public class Consigna_8 {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Ingresa el numerador: ");
        int num1 = Integer.parseInt(input.nextLine());

        System.out.print("Ingresa el denominador: ");
        int num2 = Integer.parseInt(input.nextLine());

        int resultadoInt = num1 / num2;

        double resultadoDouble = (double) num1 / num2;

        System.out.println("Resultado con int: " + resultadoInt);
        System.out.println("Division con double: " + resultadoDouble);

    }
}