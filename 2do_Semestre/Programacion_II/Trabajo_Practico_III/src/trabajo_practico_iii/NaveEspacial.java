/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class NaveEspacial {
    private String nombre;
    private int combustible;
    private static final int LIMITE_COMBUSTIBLE = 100;

    public NaveEspacial(String nombre, int combustibleInicial) {
        this.nombre = nombre;
        if (combustibleInicial < 0) {
            this.combustible = 0;
            System.out.println("Advertencia: El combustible inicial no puede ser negativo. Se establece en 0");
        } else if (combustibleInicial > LIMITE_COMBUSTIBLE) {
            this.combustible = LIMITE_COMBUSTIBLE;
            System.out.println("Advertencia: El combustible supera el limite. Se establece a " + LIMITE_COMBUSTIBLE);
        } else {
            this.combustible = combustibleInicial;
        }
    }

    public void despegar() {
        if (this.combustible > 0) {
            System.out.println(nombre + " despego exitosamente");
        } else {
            System.out.println(nombre + " no puede despegar sin combustible");
        }
    }

    public void avanzar(int distancia) {
        int consumo = distancia * 2;
        if (this.combustible >= consumo) {
            this.combustible -= consumo;
            System.out.println(nombre + " avanzo " + distancia + " unidades y consumio " + consumo + " unidades");
        } else {
            System.out.println("Error: " + nombre + " no tiene suficiente combustible (" + combustible + "/" + consumo + ")");
        }
    }

    public void recargarCombustible(int cantidad) {
        if (cantidad < 0) {
            System.out.println("Error: No se puede recargar una cantidad negativa");
            return;
        }
        if (this.combustible + cantidad > LIMITE_COMBUSTIBLE) {
            System.out.println("Advertencia: La recarga superaria el limite. Se recargara hasta " + LIMITE_COMBUSTIBLE);
            this.combustible = LIMITE_COMBUSTIBLE;
        } else {
            this.combustible += cantidad;
            System.out.println(nombre + " recargo " + cantidad + " unidades de combustible");
        }
    }

    public void mostrarEstado() {
        System.out.println("Estado de la Nave: " + nombre);
        System.out.println("Combustible: " + combustible + "/" + LIMITE_COMBUSTIBLE);
        System.out.println();
    }

    public String getNombre() { return nombre; }
    public int getCombustible() { return combustible; }
}