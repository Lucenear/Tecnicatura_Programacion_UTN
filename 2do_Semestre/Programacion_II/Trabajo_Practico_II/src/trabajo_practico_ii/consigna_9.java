/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_9 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el precio del producto: ");
        double precioProducto = Double.parseDouble(scan.nextLine());

        System.out.print("Ingrese el peso del paquete en kg: ");
        double peso = Double.parseDouble(scan.nextLine());

        System.out.print("Ingrese la zona de envio (Nacional/Internacional): ");
        String zona = scan.nextLine().trim().toUpperCase();

        double costoEnvio = calcularCostoEnvio(peso, zona);

        if (costoEnvio == -1) {
            System.out.println("Error: Zona de envio no valida. Ingrese 'Nacional' o 'Internacional'.");
            scan.close();
            return;
        }

        double total = calcularTotalCompra(precioProducto, costoEnvio);

        System.out.println("El costo de envio es: " + String.format("%.2f", costoEnvio));
        System.out.println("El total a pagar es: " + String.format("%.2f", total));
    }

    /**
     * Calcula el costo de envio segun el peso y la zona.
     * 
     * @param peso Peso del paquete en kg
     * @param zona Zona de envio: "NACIONAL" o "INTERNACIONAL"
     * @return Costo de envio o -1 si la zona es invalida
     */
    public static double calcularCostoEnvio(double peso, String zona) {
        if (zona.equals("NACIONAL")) {
            return peso * 5;
        } else if (zona.equals("INTERNACIONAL")) {
            return peso * 10;
        } else {
            return -1;
        }
    }

    /**
     * Calcula el total de la compra sumando el precio del producto y el costo de envio.
     * 
     * @param precioProducto Precio del producto
     * @param costoEnvio     Costo calculado de envio
     * @return Total a pagar
     */
    public static double calcularTotalCompra(double precioProducto, double costoEnvio) {
        return precioProducto + costoEnvio;
    }
}