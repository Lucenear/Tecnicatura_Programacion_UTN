package excepciones;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class LeerArchivoConRecursos {
    public static void ejecutar() {
        String nombreArchivo = "datos.txt";

        try (BufferedReader lector = new BufferedReader(new FileReader(nombreArchivo))) {
            String linea;
            while ((linea = lector.readLine()) != null) {
                System.out.println(linea);
            }
        } catch (IOException e) {
            System.out.println("Error al leer el archivo: " + e.getMessage());
        }
    }
}