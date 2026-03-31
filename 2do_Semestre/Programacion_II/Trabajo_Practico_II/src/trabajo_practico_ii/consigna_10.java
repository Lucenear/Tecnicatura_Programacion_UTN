/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_10 {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el stock actual del producto: ");
        int stockActual = Integer.parseInt(scan.nextLine());

        System.out.print("Ingrese la cantidad vendida: ");
        int cantidadVendida = Integer.parseInt(scan.nextLine());

        System.out.print("Ingrese la cantidad recibida: ");
        int cantidadRecibida = Integer.parseInt(scan.nextLine());

        int nuevoStock = actualizarStock(stockActual, cantidadVendida, cantidadRecibida);

        System.out.println("El nuevo stock del producto es: " + nuevoStock);
    }

    /**
     * Actualiza el stock del producto.
     * 
     * @param stockActual      Stock actual del producto
     * @param cantidadVendida  Cantidad de unidades vendidas
     * @param cantidadRecibida Cantidad de unidades recibidas
     * @return                 Nuevo stock: stockActual - vendidos + recibidos
     */
    public static int actualizarStock(int stockActual, int cantidadVendida, int cantidadRecibida) {
        return stockActual - cantidadVendida + cantidadRecibida;
    }
}