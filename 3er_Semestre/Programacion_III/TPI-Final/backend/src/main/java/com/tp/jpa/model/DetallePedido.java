package com.tp.jpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedido extends Base {
    private int cantidad;
    private Double subtotal;
    
    @ManyToOne
    @JoinColumn(name = "producto_id")
    @EqualsAndHashCode.Include
    private Producto producto;


    public Double getSubtotal() {
        if (producto != null) {
            return cantidad * producto.getPrecio();
        }
        return subtotal != null ? subtotal : 0.0;
    }
}
