package ecommerce;

public class MainEcommerce {
    public static void main(String[] args) {
        Cliente cliente = new Cliente("Gustavo");

        Pedido pedido = new Pedido(cliente);
        pedido.agregarProducto(new Producto("Laptop", 1200.0));
        pedido.agregarProducto(new Producto("Mouse", 25.5));

        System.out.println("Total del pedido: $" + String.format("%.2f", pedido.calcularTotal()));

        Pago tarjeta = new TarjetaCredito();
        tarjeta.procesarPago(pedido.calcularTotal());

        Pago paypal = new PayPal();
        paypal.procesarPago(pedido.calcularTotal());

        pedido.cambiarEstado("Enviado");
    }
}