/**
Nombre: Farias, Gustavo
Comisión: M2025-13
Matrícula: 101662
*/

package trabajo_practico_ii;

public class consigna_13 {
    public static void main(String[] args) {

        double[] precios = {199.99, 299.50, 149.75, 399.00, 89.99};

        System.out.println("Precios originales:");
        imprimirPreciosRecursivo(precios, 0);

        precios[2] = 129.99;

        System.out.println("Precios modificados:");
        imprimirPreciosRecursivo(precios, 0);
    }

    /**
     * Funcion recursiva que imprime los precios del array.
     * 
     * @param precios Array de precios a mostrar
     * @param indice  Indice actual del recorrido
     */
    public static void imprimirPreciosRecursivo(double[] precios, int indice) {
        if (indice >= precios.length) {
            return;
        }

        System.out.println("Precio: $" + String.format("%.2f", precios[indice]));

        imprimirPreciosRecursivo(precios, indice + 1);
    }
}