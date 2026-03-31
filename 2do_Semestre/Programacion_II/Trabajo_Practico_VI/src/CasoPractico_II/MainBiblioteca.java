package CasoPractico_II;

public class MainBiblioteca {
    public static void main(String[] args) {
        Biblioteca biblio = new Biblioteca("Biblioteca Central");

        Autor autor1 = new Autor("A1", "Gabriel Garcia Marquez", "Colombiano");
        Autor autor2 = new Autor("A2", "Isabel Allende", "Chilena");
        Autor autor3 = new Autor("A3", "Mario Vargas Llosa", "Peruano");

        biblio.agregarLibro("978-3-16", "Cien anos de soledad", 1967, autor1);
        biblio.agregarLibro("978-1-23", "La casa de los espiritus", 1982, autor2);
        biblio.agregarLibro("978-5-88", "El amor en los tiempos del colera", 1985, autor1);
        biblio.agregarLibro("978-7-44", "La ciudad y los perros", 1963, autor3);
        biblio.agregarLibro("978-9-11", "Eva Luna", 1987, autor2);

        System.out.println("Todos los libros");
        biblio.listarLibros();

        System.out.println("\nBuscar libro 978-1-23");
        Libro l = biblio.buscarLibroPorIsbn("978-1-23");
        if (l != null) l.mostrarInfo();

        System.out.println("\nLibros de 1982");
        for (Libro libro : biblio.filtrarLibrosPorAnio(1982)) {
            libro.mostrarInfo();
        }

        biblio.eliminarLibro("978-9-11");
        System.out.println("\nDespues de eliminar Eva Luna");
        biblio.listarLibros();

        System.out.println("\nTotal libros: " + biblio.obtenerCantidadLibros());

        System.out.println();
        biblio.mostrarAutoresDisponibles();
    }
}