package Ejercicio10;

public class CuentaBancaria {
    private String cbu;
    private double saldo;
    private ClaveSeguridad claveSeguridad;
    private Titular titular;

    public CuentaBancaria(String cbu, double saldo, String codigoClave, String fechaMod, Titular titular) {
        this.cbu = cbu;
        this.saldo = saldo;
        this.claveSeguridad = new ClaveSeguridad(codigoClave, fechaMod);
        this.titular = titular;
    }

    public ClaveSeguridad getClaveSeguridad() { return claveSeguridad; }
    public Titular getTitular() { return titular; }
    public String getCbu() { return cbu; }
    public double getSaldo() { return saldo; }
}