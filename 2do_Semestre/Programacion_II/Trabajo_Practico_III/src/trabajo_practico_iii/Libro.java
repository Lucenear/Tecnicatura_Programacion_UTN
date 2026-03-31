/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class Libro {
    private String titulo;
    private String autor;
    private int añoPublicacion;

    public Libro(String titulo, String autor, int añoPublicacion) {
        this.titulo = titulo;
        this.autor = autor;
        setAñoPublicacion(añoPublicacion);
    }

    public String getTitulo() { return titulo; }
    public String getAutor() { return autor; }
    public int getAñoPublicacion() { return añoPublicacion; }

    public void setAñoPublicacion(int añoPublicacion) {
        if (añoPublicacion < 0 || añoPublicacion > 2025) {
            System.out.println("Error: El año de publicacion debe estar entre 1 y 2025. No se realizo el cambio");
        } else {
            this.añoPublicacion = añoPublicacion;
            System.out.println("Año de publicacion actualizado correctamente a: " + añoPublicacion);
        }
    }

    public void mostrarInfo() {
        System.out.println("Titulo: " + titulo);
        System.out.println("Autor: " + autor);
        System.out.println("Año de publicacion: " + añoPublicacion);
    }
}