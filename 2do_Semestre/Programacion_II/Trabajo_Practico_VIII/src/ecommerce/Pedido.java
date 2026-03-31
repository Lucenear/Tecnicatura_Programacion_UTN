package ecommerce;

import java.util.ArrayList;
import java.util.List;

public class Pedido implements Pagable, Notificable {
    private List<Producto> productos;
    private String estado;
    private Cliente cliente;

    public Pedido(Cliente cliente) {
        this.productos = new ArrayList<>();
        this.cliente = cliente;
        this.estado = "Creado";
    }

    public void agregarProducto(Producto producto) {
        productos.add(producto);
    }

    @Override
    public double calcularTotal() {
        return productos.stream().mapToDouble(Producto::calcularTotal).sum();
    }

    public void cambiarEstado(String nuevoEstado) {
        this.estado = nuevoEstado;
        notificar();
    }

    @Override
    public void notificar() {
        cliente.recibirNotificacion("El estado de tu pedido ha cambiado a " + estado);
    }
}