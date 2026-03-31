package ecommerce;

public class PayPal implements Pago {
    @Override
    public void procesarPago(double monto) {
        System.out.println("Pago con PayPal procesado: $" + String.format("%.2f", monto));
    }
}