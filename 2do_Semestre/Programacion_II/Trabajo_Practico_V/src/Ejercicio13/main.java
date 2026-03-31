package Ejercicio13;

public class main {
    public static void main(String[] args) {
        Usuario usuario = new Usuario("Camila Diaz", "67890123");
        GeneradorQR generador = new GeneradorQR();
        System.out.println("Ejercicio 13 - Generacion de QR:");
        generador.generar("https://ejemplo.com", usuario);
    }
}