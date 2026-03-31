/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_3 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese su edad: ");
        int edad = Integer.parseInt(scan.nextLine());

        String etapa;

        if (edad < 12) {
            etapa = "Niño";
        } else if (edad >= 12 && edad <= 17) {
            etapa = "Adolescente";
        } else if (edad >= 18 && edad <= 59) {
            etapa = "Adulto";
        } else if (edad >= 60) {
            etapa = "Adulto mayor";
        } else {
            etapa = "Edad no valida";
        }

        if (edad >= 0) {
            System.out.println("Usted es: " + etapa);
        } else {
            System.out.println("Error: La edad no puede ser negativa.");
        }
    }
}