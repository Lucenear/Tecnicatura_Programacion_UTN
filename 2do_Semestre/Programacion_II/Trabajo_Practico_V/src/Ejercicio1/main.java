package Ejercicio1;

public class main {
    public static void main(String[] args) {
        Titular titular = new Titular("Ana Perez", "12345678");
        Pasaporte pasaporte = new Pasaporte("P123456789", "2025-01-01", "ana_foto.jpg", "JPEG", titular);
        System.out.println("Ejercicio 1 - Pasaporte creado:");
        System.out.println("Titular: " + pasaporte.getTitular().getNombre());
        System.out.println("Foto: " + pasaporte.getFoto().getImagen());
    }
}


