package ecommerce;

public class TarjetaCredito implements PagoConDescuento {
    @Override
    public double aplicarDescuento(double monto) {
        return monto * 0.95;
    }

    @Override
    public void procesarPago(double monto) {
        double total = aplicarDescuento(monto);
        System.out.println("Pago con tarjeta de credito procesado: $" + String.format("%.2f", total));
    }
}