package ar.edu.tup.programacion3;

import ar.edu.tup.programacion3.entities.*;
import ar.edu.tup.programacion3.enums.*;
import java.time.LocalDate;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Categoria catAlimentos = Categoria.builder()
                .id(1L)
                .nombre("Alimentos")
                .descripcion("Comidas rapidas y snacks")
                .build();

        Categoria catBebidas = Categoria.builder()
                .id(2L)
                .nombre("Bebidas")
                .descripcion("Gaseosas y tragos")
                .build();

        Producto p1 = Producto.builder()
                .id(1L)
                .nombre("Pancho")
                .precio(1500.0)
                .stock(10)
                .disponible(true)
                .categoria(catAlimentos)
                .build();

        Producto p2 = Producto.builder()
                .id(2L)
                .nombre("Bebida")
                .precio(1000.0)
                .stock(15)
                .disponible(true)
                .categoria(catBebidas)
                .build();

        Producto p3 = Producto.builder()
                .id(3L)
                .nombre("Papas Fritas")
                .precio(1200.0)
                .stock(3)
                .disponible(true)
                .categoria(catAlimentos)
                .build();

        Producto p4 = Producto.builder()
                .id(4L)
                .nombre("Cerveza")
                .precio(4000.0)
                .stock(20)
                .disponible(false)
                .categoria(catBebidas)
                .build();

        Producto p5 = Producto.builder()
                .id(5L)
                .nombre("Aderezo")
                .precio(200.0)
                .stock(4)
                .disponible(true)
                .categoria(catAlimentos)
                .build();

        List<Producto> productos = List.of(p1, p2, p3, p4, p5);

        Usuario usuario = Usuario.builder()
                .id(1L)
                .nombre("Lucas")
                .apellido("Gomez")
                .mail("lucas.gomez@mail.com")
                .celular("261234567")
                .contrasena("secure123")
                .rol(Rol.USUARIO)
                .build();

        Pedido pedido = Pedido.builder()
                .id(1L)
                .fecha(LocalDate.now())
                .estado(Estado.PENDIENTE)
                .formaPago(FormaPago.EFECTIVO)
                .usuario(usuario)
                .build();

        pedido.addDetallePedido(2, p1);
        pedido.addDetallePedido(2, p2);

        usuario.addPedido(pedido);

        System.out.println("Productos disponibles:");
        productos.stream()
                .filter(Producto::getDisponible)
                .forEach(p -> System.out.println("- " + p.getNombre() + " (Precio: " + p.getPrecio() + ")"));
        System.out.println();

        int totalItems = pedido.getDetalles().stream()
                .mapToInt(DetallePedido::getCantidad)
                .sum();
        System.out.println("Cantidad de items del pedido: " + totalItems);
        System.out.println("Total del pedido: " + pedido.getTotal());
        System.out.println();

        System.out.println("Productos con stock menor a 5:");
        productos.stream()
                .filter(p -> p.getStock() < 5)
                .forEach(p -> System.out.println("- " + p.getNombre() + " (Stock: " + p.getStock() + ")"));
    }
}
