package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Pedido extends Base implements Calculable {
    private LocalDate fecha;
    private Double total;
    private Estado estado;
    private FormaPago formaPago;
    private Set<DetallePedido> detalles = new HashSet<>();
    private Usuario usuario;

    public Pedido(LocalDate fecha, Estado estado, FormaPago formaPago, Usuario usuario) {
        super();
        this.fecha = fecha;
        this.estado = estado;
        this.formaPago = formaPago;
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Pedido pedido = (Pedido) o;
        return Objects.equals(getFecha(), pedido.getFecha()) && Objects.equals(getUsuario(), pedido.getUsuario());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getFecha(), getUsuario());
    }

    public void addDetallePedido(int cantidad, Producto producto) {
        this.detalles.add(new DetallePedido(cantidad, producto));
        calcularTotal();
    }

    public DetallePedido findeDetallePedidoByProducto(Producto producto) {
        for (DetallePedido dp : detalles) {
            if (dp.getProducto().equals(producto)) {
                return dp;
            }
        }
        return null;
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        DetallePedido dp = findeDetallePedidoByProducto(producto);
        if (dp != null) {
            detalles.remove(dp);
            calcularTotal();
        }
    }

    @Override
    public void calcularTotal() {
        this.total = detalles.stream()
                .mapToDouble(DetallePedido::getSubtotal)
                .sum();
    }

    public LocalDate getFecha() { return fecha; }
    public Double getTotal() { return total; }
    public Estado getEstado() { return estado; }
    public Set<DetallePedido> getDetalles() { return detalles; }
    public Usuario getUsuario() { return usuario; }

    @Override
    public String toString() {
        return "Pedido{" +
                "fecha=" + fecha +
                ", total=" + total +
                ", estado=" + estado +
                ", detallesCount=" + detalles.size() +
                '}';
    }
}