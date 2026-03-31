package Ejercicio6;

public class main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Lucia Fernandez", "34567890");
        Mesa mesa = new Mesa(5, 4);
        Reserva reserva = new Reserva("2025-10-20", "20:00", cliente, mesa);
        System.out.println("Ejercicio 6 - Reserva creada:");
        System.out.println("Cliente: " + reserva.getCliente().getNombre());
        System.out.println("Mesa: " + reserva.getMesa().getNumero());
    }
}