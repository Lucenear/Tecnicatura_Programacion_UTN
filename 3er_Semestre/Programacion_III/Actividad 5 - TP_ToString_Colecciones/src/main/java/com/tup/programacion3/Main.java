package com.tup.programacion3;

import com.tup.programacion3.entities.Categoria;
import com.tup.programacion3.entities.Pedido;
import com.tup.programacion3.entities.Producto;
import com.tup.programacion3.entities.Usuario;
import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;
import com.tup.programacion3.enums.Rol;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Categoria cat1 = new Categoria("Electronica", "Tecnologia");
        Categoria cat2 = new Categoria("Ropa", "Indumentaria");
        Categoria cat3 = new Categoria("Hogar", "Decoracion");

        List<Producto> productos = new ArrayList<>();
        productos.add(new Producto(1L, "Celular Samsung Galaxy S23", 850000.0, cat1));
        productos.add(new Producto(2L, "Zapatillas Nike Air Max", 120000.0, cat2));
        productos.add(new Producto(3L, "Sofa 3 cuerpos", 450000.0, cat3));
        productos.add(new Producto(4L, "Notebook Lenovo", 1250000.0, cat1));
        productos.add(new Producto(5L, "Pantalon levis", 75000.0, cat2));
        productos.add(new Producto(6L, "Juego de sabanas", 85000.0, cat3));
        productos.add(new Producto(7L, "Auriculares Sony", 95000.0, cat1));
        productos.add(new Producto(8L, "Camiseta algodon ", 25000.0, cat2));
        productos.add(new Producto(9L, "Lampara de pie", 45000.0, cat3));
        productos.add(new Producto(10L, "Smart TV LG", 650000.0, cat1));

        Usuario u1 = new Usuario("Juan", "Perez", "juan@gmail.com", Rol.USUARIO);
        Usuario u2 = new Usuario("Maria", "Lopez", "maria@gmail.com", Rol.ADMIN);

        Pedido p1 = new Pedido(LocalDate.now(), Estado.PENDIENTE, FormaPago.TARJETA, u1);
        p1.addDetallePedido(2, productos.get(0));
        p1.addDetallePedido(1, productos.get(1));
        u1.addPedido(p1);

        Pedido p2 = new Pedido(LocalDate.now().minusDays(1), Estado.CONFIRMADO, FormaPago.EFECTIVO, u1);
        p2.addDetallePedido(5, productos.get(2));
        p2.addDetallePedido(3, productos.get(3));
        u1.addPedido(p2);

        Pedido p3 = new Pedido(LocalDate.now(), Estado.TERMINADO, FormaPago.TRANSFERENCIA, u2);
        p3.addDetallePedido(1, productos.get(4));
        p3.addDetallePedido(2, productos.get(5));
        u2.addPedido(p3);

        System.out.println("*** 1. UN PRODUCTO ***");
        System.out.println(productos.get(0));

        System.out.println("\n*** 2. LISTADO DE PRODUCTOS ***");
        for (Producto p : productos) {
            System.out.println(p);
        }

        System.out.println("\n*** 3. PEDIDOS DEL USUARIO CON MAS PEDIDOS ***");
        Usuario top = u1.getCantidadPedidos() >= u2.getCantidadPedidos() ? u1 : u2;
        System.out.println("Usuario: " + top.getNombreCompleto() + " | Pedidos: " + top.getCantidadPedidos());
        for (Pedido ped : top.getPedidos()) {
            System.out.println(" - " + ped);
        }

        System.out.println("\n*** 4. PRUEBA DE EQUALS ***");
        Producto clon = new Producto(1L, "Clon de celular", 999.9, cat1);

        boolean encontrado = false;
        for (Producto p : productos) {
            if (p.equals(clon)) {
                System.out.println("Coincidencia encontrada:");
                System.out.println("Original: " + p);
                System.out.println("Clon:     " + clon);
                System.out.println("Mismo objeto en memoria? " + (p == clon));
                encontrado = true;
                break;
            }
        }
        if (!encontrado) {
            System.out.println("No se encontro coincidencia");
        }
        System.out.println("La lista contiene al clon? " + productos.contains(clon));
    }
}