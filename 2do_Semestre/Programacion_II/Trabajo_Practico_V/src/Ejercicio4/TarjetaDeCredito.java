package Ejercicio4;

public class TarjetaDeCredito {
    private String numero;
    private String fechaVencimiento;
    private Cliente cliente;
    private Banco banco;

    public TarjetaDeCredito(String numero, String fechaVencimiento, Cliente cliente, Banco banco) {
        this.numero = numero;
        this.fechaVencimiento = fechaVencimiento;
        this.cliente = cliente;
        this.banco = banco;
    }

    public Cliente getCliente() { return cliente; }
    public Banco getBanco() { return banco; }
    public String getNumero() { return numero; }
    public String getFechaVencimiento() { return fechaVencimiento; }
}