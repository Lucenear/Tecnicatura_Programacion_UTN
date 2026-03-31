package Ejercicio3;

public class main {
    public static void main(String[] args) {
        Autor autor = new Autor("Gabriel Garcia Marquez", "Colombiano");
        Editorial editorial = new Editorial("Sudamericana", "Buenos Aires");
        Libro libro = new Libro("Cien años de soledad", "978-3-16-148410-0", autor, editorial);
        System.out.println("Ejercicio 3 - Libro creado:");
        System.out.println("Autor: " + libro.getAutor().getNombre());
        System.out.println("Editorial: " + libro.getEditorial().getNombre());
    }
}