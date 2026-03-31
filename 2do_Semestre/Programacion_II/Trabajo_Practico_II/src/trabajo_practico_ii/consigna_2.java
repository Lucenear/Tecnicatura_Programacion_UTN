/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_2 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el primer número: ");
        int num1 = Integer.parseInt(scan.nextLine());

        System.out.print("Ingrese el segundo número: ");
        int num2 = Integer.parseInt(scan.nextLine());

        System.out.print("Ingrese el tercer número: ");
        int num3 = Integer.parseInt(scan.nextLine());

        int mayor = num1;

        if (num2 > mayor) {
            mayor = num2;
        }

        if (num3 > mayor) {
            mayor = num3;
        }

        System.out.println("El número mayor es: " + mayor);
    }
}