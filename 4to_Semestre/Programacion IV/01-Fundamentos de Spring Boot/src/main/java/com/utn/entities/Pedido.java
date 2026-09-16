package com.utn.entities;

import com.utn.enums.Estado;
import com.utn.enums.FormaPago;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@ToString(exclude = "usuario", callSuper = true)
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
    
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "pedido_id")
    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @EqualsAndHashCode.Include
    private Usuario usuario;

    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido dp = DetallePedido.builder()
                .cantidad(cantidad)
                .producto(producto)
                .build();
        this.detalles.add(dp);
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
}
