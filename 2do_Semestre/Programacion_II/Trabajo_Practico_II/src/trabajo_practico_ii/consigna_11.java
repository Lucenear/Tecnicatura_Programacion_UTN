/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

import java.util.Scanner;

public class consigna_11 {

    private static final double DESCUENTO_ESPECIAL = 0.10;

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);

        System.out.print("Ingrese el precio del producto: ");
        double precio = Double.parseDouble(scan.nextLine());

        calcularDescuentoEspecial(precio);
    }

    /**
     * Calcula y muestra el descuento especial usando la variable estatica.
     * 
     * @param precio Precio original del producto
     */
    public static void calcularDescuentoEspecial(double precio) {
        double descuentoAplicado = precio * DESCUENTO_ESPECIAL;

        double precioFinal = precio - descuentoAplicado;

        System.out.println("El descuento especial aplicado es: " + descuentoAplicado);
        System.out.println("El precio final con descuento es: " + precioFinal);
    }
}