/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_4 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el precio del producto: ");
        double precioOriginal = Double.parseDouble(scan.nextLine());

        System.out.print("Ingrese la categoria (A, B o C): ");
        String categoria = scan.nextLine().trim().toUpperCase();

        if (!categoria.equals("A") && !categoria.equals("B") && !categoria.equals("C")) {
            System.out.println("Error: Categoria no valida. Debe ser A, B o C");
            return;
        }

        double porcentajeDescuento;

        switch (categoria) {
            case "A":
                porcentajeDescuento = 10;
                break;
            case "B":
                porcentajeDescuento = 15;
                break;
            case "C":
                porcentajeDescuento = 20;
                break;
            default:
                porcentajeDescuento = 0;
        }

        double descuento = precioOriginal * (porcentajeDescuento / 100);
        double precioFinal = precioOriginal - descuento;

        System.out.println("Precio original: $" + String.format("%.2f", precioOriginal));
        System.out.println("Descuento aplicado: " + porcentajeDescuento + "% ($" + String.format("%.2f", descuento) + ")");
        System.out.println("Precio final: $" + String.format("%.2f", precioFinal));
    }
}