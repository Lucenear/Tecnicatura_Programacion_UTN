package Ejercicio4;

public class main {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("María Gomez", "23456789");
        Banco banco = new Banco("Banco Nacion", "30-12345678-9");
        TarjetaDeCredito tarjeta = new TarjetaDeCredito("1234 5678 9012 3456", "12/28", cliente, banco);
        System.out.println("Ejercicio 4 - Tarjeta creada:");
        System.out.println("Cliente: " + tarjeta.getCliente().getNombre());
        System.out.println("Banco: " + tarjeta.getBanco().getNombre());
    }
}