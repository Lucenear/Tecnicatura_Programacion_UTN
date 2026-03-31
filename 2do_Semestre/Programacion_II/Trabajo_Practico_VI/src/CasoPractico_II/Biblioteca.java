package CasoPractico_II;

import java.util.*;

public class Biblioteca {
    private String nombre;
    private List<Libro> libros;

    public Biblioteca(String nombre) {
        this.nombre = nombre;
        this.libros = new ArrayList<>();
    }

    public void agregarLibro(String isbn, String titulo, int anioPublicacion, Autor autor) {
        libros.add(new Libro(isbn, titulo, anioPublicacion, autor));
    }

    public void listarLibros() {
        if (libros.isEmpty()) {
            System.out.println("No hay libros.");
            return;
        }
        for (Libro l : libros) {
            l.mostrarInfo();
        }
    }

    public Libro buscarLibroPorIsbn(String isbn) {
        for (Libro l : libros) {
            if (l.getIsbn().equals(isbn)) {
                return l;
            }
        }
        return null;
    }

    public boolean eliminarLibro(String isbn) {
        return libros.removeIf(l -> l.getIsbn().equals(isbn));
    }

    public int obtenerCantidadLibros() {
        return libros.size();
    }

    public List<Libro> filtrarLibrosPorAnio(int anio) {
        List<Libro> resultado = new ArrayList<>();
        for (Libro l : libros) {
            if (l.getAnioPublicacion() == anio) {
                resultado.add(l);
            }
        }
        return resultado;
    }

    public void mostrarAutoresDisponibles() {
        Set<String> autores = new HashSet<>();
        for (Libro l : libros) {
            autores.add(l.getAutor().getNombre());
        }
        System.out.println("Autores disponibles: " + autores);
    }
}