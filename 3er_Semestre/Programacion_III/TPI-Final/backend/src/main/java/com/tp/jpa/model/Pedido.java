package com.tp.jpa.model;

import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.Builder;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Pedido extends Base implements Calculable {
    @EqualsAndHashCode.Include
    private LocalDate fecha;
    
    private Double total;

    @Enumerated(EnumType.STRING)
    private Estado estado;
    
    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;
    
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();

    public void addDetallePedido(int cantidad, Producto producto) {
        if (producto == null) {
            System.out.println("Error: El producto no puede ser nulo al agregar un detalle.");
            return;
        }
        if (cantidad <= 0) {
            System.out.println("Error: La cantidad debe ser mayor a 0 al agregar un detalle.");
            return;
        }
        DetallePedido dp = DetallePedido.builder()
                .cantidad(cantidad)
                .producto(producto)
                .subtotal(producto.getPrecio() * cantidad)
                .build();
        this.detalles.add(dp);
        calcularTotal();
    }

    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        for (DetallePedido dp : detalles) {
            if (dp.getProducto().equals(producto)) {
                return dp;
            }
        }
        return null;
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        if (producto == null) {
            System.out.println("Error: El producto no puede ser nulo al intentar eliminar un detalle.");
            return;
        }
        DetallePedido dp = findDetallePedidoByProducto(producto);
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
}
