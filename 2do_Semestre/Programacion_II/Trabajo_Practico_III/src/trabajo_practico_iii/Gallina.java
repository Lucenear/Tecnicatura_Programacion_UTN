/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class Gallina {
    private int idGallina;
    private int edad;
    private int huevosPuestos;

    public Gallina(int idGallina, int edad) {
        this.idGallina = idGallina;
        this.edad = edad >= 0 ? edad : 0;
        this.huevosPuestos = 0;
    }

    public void ponerHuevo() {
        if (this.edad >= 1) {
            this.huevosPuestos++;
            System.out.println("La gallina " + idGallina + " puso un huevo! Total: " + huevosPuestos);
        } else {
            System.out.println("La gallina " + idGallina + " es joven para poner huevos");
        }
    }

    public void envejecer() {
        this.edad++;
        System.out.println("La gallina " + idGallina + " ha envejecido. Ahora tiene " + edad + " años");
    }

    public void mostrarEstado() {
        System.out.println("Estado de la gallina " + idGallina);
        System.out.println("Edad: " + edad + " años");
        System.out.println("Huevos puestos: " + huevosPuestos);
        System.out.println();
    }

    public int getIdGallina() { return idGallina; }
    public int getEdad() { return edad; }
    public int getHuevosPuestos() { return huevosPuestos; }

}