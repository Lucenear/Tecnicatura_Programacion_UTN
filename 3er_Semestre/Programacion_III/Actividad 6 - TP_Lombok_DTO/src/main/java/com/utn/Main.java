package com.utn;

import com.utn.entities.*;
import com.utn.enums.*;
import com.utn.dtos.UsuarioDTO;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Categoria cat1 = Categoria.builder()
                .id(1L)
                .nombre("Electronica")
                .descripcion("Dispositivos electronicos")
                .build();

        Categoria cat2 = Categoria.builder()
                .id(2L)
                .nombre("Bazar")
                .descripcion("Articulos para el hogar")
                .build();

        Categoria cat3 = Categoria.builder()
                .id(3L)
                .nombre("Indumentaria")
                .descripcion("Ropa y calzado")
                .build();

        List<Categoria> categorias = List.of(cat1, cat2, cat3);

        Producto p1 = Producto.builder().id(1L).nombre("Televisor").precio(120000.0).categoria(cat1).stock(15).build();
        Producto p2 = Producto.builder().id(2L).nombre("Celular").precio(85000.0).categoria(cat1).stock(30).build();
        Producto p3 = Producto.builder().id(3L).nombre("Notebook").precio(250000.0).categoria(cat1).stock(10).build();
        Producto p4 = Producto.builder().id(4L).nombre("Auriculares").precio(15000.0).categoria(cat1).stock(50).build();
        Producto p5 = Producto.builder().id(5L).nombre("Sarten").precio(8500.0).categoria(cat2).stock(25).build();
        Producto p6 = Producto.builder().id(6L).nombre("Plato").precio(1200.0).categoria(cat2).stock(100).build();
        Producto p7 = Producto.builder().id(7L).nombre("Vaso").precio(800.0).categoria(cat2).stock(120).build();
        Producto p8 = Producto.builder().id(8L).nombre("Remera").precio(4500.0).categoria(cat3).stock(40).build();
        Producto p9 = Producto.builder().id(9L).nombre("Pantalon").precio(9500.0).categoria(cat3).stock(20).build();
        Producto p10 = Producto.builder().id(10L).nombre("Zapatillas").precio(35000.0).categoria(cat3).stock(15).build();

        List<Producto> productos = List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

        Usuario u1 = Usuario.builder()
                .id(1L)
                .nombre("Juan")
                .apellido("Perez")
                .mail("juan.perez@utn.com")
                .celular("261123456")
                .contrasena("juan123")
                .rol(Rol.ADMIN)
                .build();

        Usuario u2 = Usuario.builder()
                .id(2L)
                .nombre("Maria")
                .apellido("Gomez")
                .mail("maria.gomez@utn.com")
                .celular("261987654")
                .contrasena("maria456")
                .rol(Rol.USUARIO)
                .build();

        DetallePedido dp1 = DetallePedido.builder().id(1L).cantidad(2).producto(p1).subtotal(2 * p1.getPrecio()).build();
        DetallePedido dp2 = DetallePedido.builder().id(2L).cantidad(1).producto(p2).subtotal(1 * p2.getPrecio()).build();
        Set<DetallePedido> detalles1 = new HashSet<>();
        detalles1.add(dp1);
        detalles1.add(dp2);

        Pedido pedido1 = Pedido.builder()
                .id(1L)
                .fecha(LocalDate.now())
                .estado(Estado.PENDIENTE)
                .formaPago(FormaPago.EFECTIVO)
                .usuario(u1)
                .detalles(detalles1)
                .total(detalles1.stream().mapToDouble(DetallePedido::getSubtotal).sum())
                .build();
        u1.addPedido(pedido1);

        DetallePedido dp3 = DetallePedido.builder().id(3L).cantidad(1).producto(p3).subtotal(1 * p3.getPrecio()).build();
        DetallePedido dp4 = DetallePedido.builder().id(4L).cantidad(4).producto(p4).subtotal(4 * p4.getPrecio()).build();
        Set<DetallePedido> detalles2 = new HashSet<>();
        detalles2.add(dp3);
        detalles2.add(dp4);

        Pedido pedido2 = Pedido.builder()
                .id(2L)
                .fecha(LocalDate.now().minusDays(1))
                .estado(Estado.CONFIRMADO)
                .formaPago(FormaPago.TARJETA)
                .usuario(u1)
                .detalles(detalles2)
                .total(detalles2.stream().mapToDouble(DetallePedido::getSubtotal).sum())
                .build();
        u1.addPedido(pedido2);

        DetallePedido dp5 = DetallePedido.builder().id(5L).cantidad(3).producto(p5).subtotal(3 * p5.getPrecio()).build();
        DetallePedido dp6 = DetallePedido.builder().id(6L).cantidad(6).producto(p6).subtotal(6 * p6.getPrecio()).build();
        Set<DetallePedido> detalles3 = new HashSet<>();
        detalles3.add(dp5);
        detalles3.add(dp6);

        Pedido pedido3 = Pedido.builder()
                .id(3L)
                .fecha(LocalDate.now())
                .estado(Estado.PENDIENTE)
                .formaPago(FormaPago.TRANSFERENCIA)
                .usuario(u2)
                .detalles(detalles3)
                .total(detalles3.stream().mapToDouble(DetallePedido::getSubtotal).sum())
                .build();
        u2.addPedido(pedido3);

        System.out.println("Un producto:");
        System.out.println(p1);
        System.out.println();

        System.out.println("Listado de productos cargados:");
        for (Producto prod : productos) {
            System.out.println(prod);
        }
        System.out.println();

        Usuario usuarioMasPedidos = (u1.getCantidadPedidos() > u2.getCantidadPedidos()) ? u1 : u2;
        System.out.println("Pedidos del usuario con mayor cantidad de pedidos (" + usuarioMasPedidos.getNombreCompleto() + "):");
        for (Pedido ped : usuarioMasPedidos.getPedidos()) {
            System.out.println(ped);
        }
        System.out.println();

        Producto productoRepetido = Producto.builder()
                .id(3L)
                .nombre("Notebook Clon")
                .precio(280000.0)
                .categoria(cat1)
                .build();

        System.out.println("Resultados de la comparacion con equals para el producto de id 3:");
        for (Producto prod : productos) {
            boolean sonIguales = productoRepetido.equals(prod);
            System.out.println("Comparando con " + prod.getNombre() + " (ID: " + prod.getId() + ") -> Son iguales: " + sonIguales);
        }
        System.out.println();

        System.out.println("Usuario DTO sin informacion sensible:");
        UsuarioDTO dto = UsuarioDTO.fromUsuario(u1);
        System.out.println(dto);
    }
}
