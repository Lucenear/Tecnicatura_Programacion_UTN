package ecommerce;

public interface PagoConDescuento extends Pago {
    double aplicarDescuento(double monto);
}