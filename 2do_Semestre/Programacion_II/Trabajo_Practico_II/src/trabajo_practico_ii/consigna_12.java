/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

public class consigna_12 {
    public static void main(String[] args) {

        double[] precios = {199.99, 299.50, 149.75, 399.00, 89.99};

        System.out.println("Precios originales:");
        mostrarPrecios(precios);

        precios[2] = 129.99;

        System.out.println("Precios modificados:");
        mostrarPrecios(precios);
    }

    /**
     * Muestra los precios del array.
     * 
     * @param precios Array de precios a mostrar
     */
    public static void mostrarPrecios(double[] precios) {
        for (double precio : precios) {
            System.out.println("Precio: $" + String.format("%.2f", precio));
        }
    }
}