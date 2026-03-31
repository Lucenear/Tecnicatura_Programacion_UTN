/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class Estudiante {
    private String nombre;
    private String apellido;
    private String curso;
    private double calificacion;

    public Estudiante(String nombre, String apellido, String curso, double calificacion) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.curso = curso;
        this.calificacion = calificacion;
    }

    public void mostrarInfo() {        
        System.out.println("Nombre: " + nombre + " " + apellido);
        System.out.println("Curso: " + curso);
        System.out.println("Calificacion: " + calificacion);
    }

    public void subirCalificacion(double puntos) {
        if (puntos < 0) {
            System.out.println("Error: No se puede subir una cantidad negativa de puntos");
            return;
        }
        this.calificacion += puntos;
        System.out.println("La calificacion se ha aumentado en " + puntos + " puntos");
    }

    public void bajarCalificacion(double puntos) {
        if (puntos < 0) {
            System.out.println("Eror: No se puede bajar una cantidad negativa de puntos");
            return;
        }
        if (this.calificacion - puntos < 0) {
            System.out.println("Advertencia: La calificacion no puede ser negativa. Se establecera a 0");
            this.calificacion = 0;
        } else {
            this.calificacion -= puntos;
        }
        System.out.println("La calificacion se ha disminuido en " + puntos + " puntos");
    }

    public String getNombre() { return nombre; }
    public String getApellido() { return apellido; }
    public String getCurso() { return curso; }
    public double getCalificacion() { return calificacion; }

}