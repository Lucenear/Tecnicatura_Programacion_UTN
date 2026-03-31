package excepciones;

import java.util.Scanner;

public class MainExcepciones {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("--> Prueba 1: Division segura");
        DivisionSegura.ejecutar(scanner);

        System.out.println("\n--> Prueba 2: Conversion de cadena a numero");
        ConversionNumero.ejecutar(scanner);

        System.out.println("\n--> Prueba 3: Lectura de archivo (sin try-with-resources)");
        LecturaArchivo.ejecutar();

        System.out.println("\n--> Prueba 4: Validacion de edad con excepcion personalizada");
        ValidarEdad.ejecutar(scanner);

        System.out.println("\n--> Prueba 5: Lectura con try-with-resources");
        LeerArchivoConRecursos.ejecutar();

        scanner.close();
    }
}