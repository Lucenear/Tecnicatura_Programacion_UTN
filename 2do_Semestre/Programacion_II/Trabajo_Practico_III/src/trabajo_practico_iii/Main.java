/**
 * Nombre: Farias, Gustavo
 * Comisión: M2025-13
 * Matrícula: 101662
 */

package trabajo_practico_iii;

public class Main {
    public static void main(String[] args) {

        System.out.println("\nEjercicio 1 - Registro de estudiantes\n");
        Estudiante estudiante = new Estudiante("Gustavo", "Farias", "Programacion II", 8.5);
        estudiante.mostrarInfo();
        estudiante.subirCalificacion(1.0);
        estudiante.bajarCalificacion(0.5);
        System.out.println("Calificacion actual: " + estudiante.getCalificacion()); //uso getter
        estudiante.mostrarInfo();
        System.out.println();

        System.out.println("\nEjercicio 2 - Registro de mascotas\n");
        Mascota mascota = new Mascota("Athena", "Gato", 2);
        mascota.mostrarInfo();
        System.out.println("Edad actual: " + mascota.getEdad()); //uso getter
        mascota.cumplirAnios();
        mascota.mostrarInfo();
        System.out.println();

        System.out.println("\nEjercicio 3 - Biblioteca\n");
        Libro libro = new Libro("El jardin de los cerezos", "Anton Chejov", 1904);
        libro.mostrarInfo();
        libro.setAñoPublicacion(2030); // valor incorrecto - rechaza
        libro.setAñoPublicacion(1984); // valor ok
        System.out.println("Año actual: " + libro.getAñoPublicacion()); // uso getter
        libro.mostrarInfo();
        System.out.println();

        System.out.println("\nEjercicio 4 - El gallinero\n");
        Gallina gallina1 = new Gallina(1, 0);
        Gallina gallina2 = new Gallina(2, 2);

        gallina1.envejecer(); // Con un año puede poner huevos
        gallina1.ponerHuevo();
        gallina1.ponerHuevo();
        System.out.println("Huevos puestos por gallina " + gallina1.getIdGallina() + ": " + gallina1.getHuevosPuestos()); // uso getter
        gallina1.mostrarEstado();

        gallina2.ponerHuevo();
        gallina2.envejecer();
        gallina2.mostrarEstado();
        System.out.println();

        System.out.println("\nEjercicio 5 - Nave Espacial\n");
        NaveEspacial nave = new NaveEspacial("Apolo XI", 50);
        nave.mostrarEstado();
        nave.avanzar(30); // Intento avanzar sin combustible suficiente
        nave.recargarCombustible(20); // Recargo
        nave.avanzar(30); // Puedo avanzar
        System.out.println("Combustible restante: " + nave.getCombustible()); // uso getter
        nave.mostrarEstado();
    }
}