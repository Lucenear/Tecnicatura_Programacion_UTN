package com.utn;

import com.utn.dtos.categoria.CategoriaCreate;
import com.utn.dtos.detallePedido.DetallePedidoCreate;
import com.utn.dtos.pedido.PedidoDto;
import com.utn.dtos.producto.ProductoCreate;
import com.utn.dtos.usuario.UsuarioCreate;
import com.utn.entities.Categoria;
import com.utn.entities.Producto;
import com.utn.entities.Usuario;
import com.utn.enums.Estado;
import com.utn.enums.FormaPago;
import com.utn.enums.Rol;
import com.utn.services.CategoriaService;
import com.utn.services.PedidoService;
import com.utn.services.ProductoService;
import com.utn.services.UsuarioService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioService usuarioService;
    private final CategoriaService categoriaService;
    private final ProductoService productoService;
    private final PedidoService pedidoService;

    public DataLoader(UsuarioService usuarioService, CategoriaService categoriaService, ProductoService productoService, PedidoService pedidoService) {
        this.usuarioService = usuarioService;
        this.categoriaService = categoriaService;
        this.productoService = productoService;
        this.pedidoService = pedidoService;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        Usuario u1 = usuarioService.create(new UsuarioCreate("Juan", "Perez", "juan@test.com", "123456789", "pass1", Rol.USUARIO));
        Usuario u2 = usuarioService.create(new UsuarioCreate("Ana", "Gomez", "ana@test.com", "987654321", "pass2", Rol.ADMIN));


        Categoria c1 = categoriaService.create(new CategoriaCreate("Electrónica", "Productos electrónicos"));
        Categoria c2 = categoriaService.create(new CategoriaCreate("Hogar", "Artículos para el hogar"));
        Categoria c3 = categoriaService.create(new CategoriaCreate("Deportes", "Artículos deportivos"));


        Producto p1 = productoService.create(new ProductoCreate("TV", 50000.0, "Smart TV", 10, "tv.jpg", true, c1.getId()));
        Producto p2 = productoService.create(new ProductoCreate("Celular", 30000.0, "Smartphone", 20, "celular.jpg", true, c1.getId()));
        Producto p3 = productoService.create(new ProductoCreate("Notebook", 80000.0, "Laptop", 15, "notebook.jpg", true, c1.getId()));
        Producto p4 = productoService.create(new ProductoCreate("Tablet", 20000.0, "Tablet Android", 30, "tablet.jpg", true, c1.getId()));
        
        Producto p5 = productoService.create(new ProductoCreate("Mesa", 15000.0, "Mesa comedor", 5, "mesa.jpg", true, c2.getId()));
        Producto p6 = productoService.create(new ProductoCreate("Silla", 5000.0, "Silla madera", 20, "silla.jpg", true, c2.getId()));
        Producto p7 = productoService.create(new ProductoCreate("Sofá", 40000.0, "Sofá 3 cuerpos", 3, "sofa.jpg", true, c2.getId()));
        
        Producto p8 = productoService.create(new ProductoCreate("Pelota", 2000.0, "Pelota futbol", 50, "pelota.jpg", true, c3.getId()));
        Producto p9 = productoService.create(new ProductoCreate("Raqueta", 8000.0, "Raqueta tenis", 10, "raqueta.jpg", true, c3.getId()));
        Producto p10 = productoService.create(new ProductoCreate("Bicicleta", 45000.0, "Bicicleta mountain", 8, "bici.jpg", true, c3.getId()));


        PedidoDto pd1 = new PedidoDto(null, LocalDate.now(), 0.0, Estado.CONFIRMADO, FormaPago.EFECTIVO, null);
        pedidoService.createFromDto(u1.getId(), pd1, List.of(
                new DetallePedidoCreate(1, p1.getId()),
                new DetallePedidoCreate(2, p2.getId())
        ));

        PedidoDto pd2 = new PedidoDto(null, LocalDate.now(), 0.0, Estado.PENDIENTE, FormaPago.TARJETA, null);
        pedidoService.createFromDto(u1.getId(), pd2, List.of(
                new DetallePedidoCreate(4, p6.getId()),
                new DetallePedidoCreate(1, p5.getId())
        ));

        PedidoDto pd3 = new PedidoDto(null, LocalDate.now(), 0.0, Estado.TERMINADO, FormaPago.TRANSFERENCIA, null);
        pedidoService.createFromDto(u2.getId(), pd3, List.of(
                new DetallePedidoCreate(1, p10.getId()),
                new DetallePedidoCreate(3, p8.getId())
        ));
        
        System.out.println("---------- DATA CARGADA EXITOSAMENTE ----------");
    }
}
