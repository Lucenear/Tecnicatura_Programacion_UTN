package ar.edu.tup.programacion3.entities;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString(exclude = "productos", callSuper = true)
@EqualsAndHashCode(callSuper = false, onlyExplicitlyIncluded = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Categoria extends Base {
    @EqualsAndHashCode.Include
    private String nombre;
    private String descripcion;
    @Builder.Default
    private Set<Producto> productos = new HashSet<>();
}
