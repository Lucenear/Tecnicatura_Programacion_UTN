package Ejercicio5;

public class main {
    public static void main(String[] args) {
        Propietario propietario = new Propietario("Juan Martinez");
        Computadora pc = new Computadora("Dell", "SN987654321", "X570", "AMD", propietario);
        System.out.println("Ejercicio 5 - Computadora creada:");
        System.out.println("Propietario: " + pc.getPropietario().getNombre());
        System.out.println("Placa madre: " + pc.getPlacaMadre().getModelo());
    }
}