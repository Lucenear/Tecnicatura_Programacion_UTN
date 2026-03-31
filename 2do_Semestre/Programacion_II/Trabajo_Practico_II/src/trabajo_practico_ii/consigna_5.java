/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_5 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int numero;
        int sumaPares = 0;

        System.out.println("Ingrese numeros enteros. Ingrese 0 para terminar.");

        while (true) {
            System.out.print("Ingrese un numero: ");
            numero = Integer.parseInt(scan.nextLine());

            if (numero == 0) {
                break;
            }

            if (numero % 2 == 0) {
                sumaPares += numero;
            }
        }

        System.out.println("La suma de los numeros pares ingresados es: " + sumaPares);
    }
}