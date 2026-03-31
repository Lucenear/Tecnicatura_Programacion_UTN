package excepciones;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class LecturaArchivo {
    public static void ejecutar() {
        try {
            File archivo = new File("datos.txt");
            Scanner lector = new Scanner(archivo);
            while (lector.hasNextLine()) {
                System.out.println(lector.nextLine());
            }
            lector.close();
        } catch (FileNotFoundException e) {
            System.out.println("Error: El archivo 'datos.txt' no existe.");
        }
    }
}