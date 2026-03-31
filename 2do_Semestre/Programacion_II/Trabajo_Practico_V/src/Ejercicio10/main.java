package Ejercicio10;

public class main {
    public static void main(String[] args) {
        Titular titular = new Titular("Sofia Castro", "56789012");
        CuentaBancaria cuenta = new CuentaBancaria("0000111122223333444455", 15000.0, "CLAVE456", "2025-09-01", titular);
        System.out.println("Ejercicio 10 - Cuenta bancaria creada:");
        System.out.println("Titular: " + cuenta.getTitular().getNombre());
        System.out.println("Clave: " + cuenta.getClaveSeguridad().getCodigo());
    }
}