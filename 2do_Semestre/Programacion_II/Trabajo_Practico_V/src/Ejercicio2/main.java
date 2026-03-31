package Ejercicio2;

public class main {
    public static void main(String[] args) {
        Usuario usuario = new Usuario("Carlos Lopez", "87654321");
        Bateria bateria = new Bateria("Li-Ion 5000mAh", 5000);
        Celular celular = new Celular("IMEI123456789", "Samsung", bateria, usuario);
        System.out.println("Ejercicio 2 - Celular creado:");
        System.out.println("Usuario: " + celular.getUsuario().getNombre());
        System.out.println("Bateria: " + celular.getBateria().getModelo());
    }
}