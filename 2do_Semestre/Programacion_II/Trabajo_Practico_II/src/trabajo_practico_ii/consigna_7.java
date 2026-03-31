/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_7 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int nota;

        do {
            System.out.print("Ingrese una nota (0-10): ");
            nota = Integer.parseInt(scan.nextLine());

            if (nota < 0 || nota > 10) {
                System.out.println("Error: Nota invalida. Ingrese una nota entre 0 y 10.");
            }
        } while (nota < 0 || nota > 10);

        System.out.println("Nota guardada correctamente.");
    }
}