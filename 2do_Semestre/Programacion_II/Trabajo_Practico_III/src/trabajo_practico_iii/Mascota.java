/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class Mascota {
    private String nombre;
    private String especie;
    private int edad;

    public Mascota(String nombre, String especie, int edad) {
        this.nombre = nombre;
        this.especie = especie;
        if (edad < 0) {
            System.out.println("Advertencia: La edad no puede ser negativa. Se establecera en 0");
            this.edad = 0;
        } else {
            this.edad = edad;
        }
    }

    public void mostrarInfo() {
        System.out.println("Nombre: " + nombre);
        System.out.println("Especie: " + especie);
        System.out.println("Edad: " + edad + " años");
    }

    public void cumplirAnios() {
        this.edad++;
        System.out.println(nombre + " ha cumplido un año. Ahora tiene " + edad + " años");
    }

    public String getNombre() { return nombre; }
    public String getEspecie() { return especie; }
    public int getEdad() { return edad; }

}