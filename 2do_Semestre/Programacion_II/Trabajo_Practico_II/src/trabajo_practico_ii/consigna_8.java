/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_8 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el precio base del producto: ");
        double precioBase = Double.parseDouble(scan.nextLine());

        System.out.print("Ingrese el impuesto en porcentaje (Ejemplo: 10 para 10%): ");
        double impuestoPorcentaje = Double.parseDouble(scan.nextLine());

        System.out.print("Ingrese el descuento en porcentaje (Ejemplo: 5 para 5%): ");
        double descuentoPorcentaje = Double.parseDouble(scan.nextLine());

        double precioFinal = calcularPrecioFinal(precioBase, impuestoPorcentaje, descuentoPorcentaje);

        System.out.println("El precio final del producto es: " + String.format("%.2f", precioFinal));
    }

    /**
     * Calcula el precio final de un producto aplicando impuesto y descuento.
     * 
     * @param precioBase        Precio original del producto
     * @param impuesto          Porcentaje de impuesto (ej: 10 para 10%)
     * @param descuento         Porcentaje de descuento (ej: 5 para 5%)
     * @return                  Precio final después de impuesto y descuento
     */
    public static double calcularPrecioFinal(double precioBase, double impuesto, double descuento) {
        double montoImpuesto = precioBase * (impuesto / 100);
        double montoDescuento = precioBase * (descuento / 100);

        double precioFinal = precioBase + montoImpuesto - montoDescuento;

        return precioFinal;
    }
}