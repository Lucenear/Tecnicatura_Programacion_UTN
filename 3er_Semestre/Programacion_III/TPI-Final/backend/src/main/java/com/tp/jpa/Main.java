package com.tp.jpa;

import com.tp.jpa.model.Categoria;
import com.tp.jpa.model.Producto;
import com.tp.jpa.model.Usuario;
import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.DetallePedido;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.model.enums.Estado;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.util.JPAUtil;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;

public class Main {
    private static final Scanner scanner = new Scanner(System.in);
    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();

    public static void main(String[] args) {
        boolean salir = false;
        while (!salir) {
            System.out.println("--- MENU PRINCIPAL ---");
            System.out.println("1. Gestionar Categorias");
            System.out.println("2. Gestionar Productos");
            System.out.println("3. Gestionar Usuarios");
            System.out.println("4. Gestionar Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opcion: ");
            
            String opcion = scanner.nextLine();
            
            switch (opcion) {
                case "1":
                    menuCategorias();
                    break;
                case "2":
                    menuProductos();
                    break;
                case "3":
                    menuUsuarios();
                    break;
                case "4":
                    menuPedidos();
                    break;
                case "5":
                    menuReportes();
                    break;
                case "0":
                    salir = true;
                    break;
                default:
                    System.out.println("Opcion invalida.");
            }
        }
        JPAUtil.close();
    }

    private static void menuCategorias() {
        boolean volver = false;
        while (!volver) {
            System.out.println("--- ABM CATEGORIAS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            
            String opcion = scanner.nextLine();
            
            switch (opcion) {
                case "1": altaCategoria(); break;
                case "2": modificarCategoria(); break;
                case "3": bajaCategoria(); break;
                case "4": listarCategorias(); break;
                case "0": volver = true; break;
                default: System.out.println("Opcion invalida.");
            }
        }
    }

    private static void altaCategoria() {
        System.out.print("Ingrese nombre de la categoria: ");
        String nombre = scanner.nextLine();
        if (nombre.trim().isEmpty()) {
            System.out.println("Error: el nombre no puede estar vacio.");
            return;
        }
        System.out.print("Ingrese descripcion: ");
        String descripcion = scanner.nextLine();
        
        Categoria cat = Categoria.builder().nombre(nombre).descripcion(descripcion).build();
        cat = categoriaRepo.guardar(cat);
        System.out.println("Categoria guardada exitosamente con ID: " + cat.getId());
    }

    private static void modificarCategoria() {
        if (!listarCategorias()) return;
        System.out.print("Ingrese el ID de la categoria a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Categoria> opt = categoriaRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                Categoria cat = opt.get();
                System.out.println("Valores actuales - Nombre: " + cat.getNombre() + ", Descripcion: " + cat.getDescripcion());
                System.out.print("Nuevo nombre (dejar en blanco para mantener actual): ");
                String nombre = scanner.nextLine();
                if (!nombre.trim().isEmpty()) cat.setNombre(nombre);
                System.out.print("Nueva descripcion (dejar en blanco para mantener actual): ");
                String descripcion = scanner.nextLine();
                if (!descripcion.trim().isEmpty()) cat.setDescripcion(descripcion);
                categoriaRepo.guardar(cat);
                System.out.println("Categoria modificada exitosamente.");
            } else {
                System.out.println("Error: Categoria no encontrada o dada de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void bajaCategoria() {
        System.out.print("Ingrese el ID de la categoria a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Categoria> opt = categoriaRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                if (categoriaRepo.eliminarLogico(id)) {
                    System.out.println("Categoria '" + opt.get().getNombre() + "' dada de baja exitosamente.");
                }
            } else {
                System.out.println("Error: No se encontro categoria activa con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static boolean listarCategorias() {
        List<Categoria> activas = categoriaRepo.listarActivos();
        if (activas.isEmpty()) {
            System.out.println("No hay categorias activas.");
            return false;
        }
        System.out.println("Categorias activas:");
        for (Categoria c : activas) {
            System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre() + " | Descripcion: " + c.getDescripcion());
        }
        return true;
    }

    private static void menuProductos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("--- ABM PRODUCTOS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            String opcion = scanner.nextLine();
            switch (opcion) {
                case "1": altaProducto(); break;
                case "2": modificarProducto(); break;
                case "3": bajaProducto(); break;
                case "4": listarProductos(); break;
                case "0": volver = true; break;
                default: System.out.println("Opcion invalida.");
            }
        }
    }

    private static void altaProducto() {
        if (!listarCategorias()) {
            System.out.println("Debe crear una categoria primero.");
            return;
        }
        System.out.print("Ingrese ID de la categoria para el producto: ");
        try {
            Long catId = Long.parseLong(scanner.nextLine());
            Optional<Categoria> optCat = categoriaRepo.buscarPorId(catId);
            if (!optCat.isPresent() || optCat.get().isEliminado()) {
                System.out.println("Categoria invalida.");
                return;
            }
            System.out.print("Nombre del producto: ");
            String nombre = scanner.nextLine();
            if (nombre.trim().isEmpty()) {
                System.out.println("Error: nombre vacio."); return;
            }
            System.out.print("Descripcion del producto: ");
            String descripcion = scanner.nextLine();
            System.out.print("Precio (mayor a 0): ");
            double precio = Double.parseDouble(scanner.nextLine());
            if (precio <= 0) { System.out.println("Error: el precio debe ser mayor a 0."); return; }
            System.out.print("Stock (mayor o igual a 0): ");
            int stock = Integer.parseInt(scanner.nextLine());
            if (stock < 0) { System.out.println("Error: el stock no puede ser negativo."); return; }
            System.out.print("Imagen (URL opcional): ");
            String imagen = scanner.nextLine();
            System.out.print("Disponible (S/N, default S): ");
            String dispStr = scanner.nextLine();
            boolean disponible = !dispStr.equalsIgnoreCase("N");

            Producto prod = Producto.builder().nombre(nombre).descripcion(descripcion).precio(precio)
                    .stock(stock).imagen(imagen).disponible(disponible).categoria(optCat.get()).build();
            prod = productoRepo.guardar(prod);
            System.out.println("Producto creado exitosamente con ID: " + prod.getId() + " en categoria " + optCat.get().getNombre());
        } catch (NumberFormatException e) {
            System.out.println("Entrada invalida. Cancelando operacion.");
        }
    }

    private static void modificarProducto() {
        if (!listarProductos()) return;
        System.out.print("Ingrese el ID del producto a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Producto> opt = productoRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                Producto prod = opt.get();
                System.out.println("Valores actuales:");
                System.out.println("Nombre: " + prod.getNombre() + ", Precio: " + prod.getPrecio() + ", Stock: " + prod.getStock());
                System.out.print("Nuevo nombre (dejar en blanco para mantener actual): ");
                String nombre = scanner.nextLine();
                if (!nombre.trim().isEmpty()) prod.setNombre(nombre);
                System.out.print("Nuevo precio (dejar en blanco para mantener actual): ");
                String precioStr = scanner.nextLine();
                if (!precioStr.trim().isEmpty()) {
                    double precio = Double.parseDouble(precioStr);
                    if (precio <= 0) { System.out.println("Error: el precio debe ser mayor a 0."); return; }
                    prod.setPrecio(precio);
                }
                System.out.print("Nuevo stock (dejar en blanco para mantener actual): ");
                String stockStr = scanner.nextLine();
                if (!stockStr.trim().isEmpty()) {
                    int stock = Integer.parseInt(stockStr);
                    if (stock < 0) { System.out.println("Error: el stock no puede ser negativo."); return; }
                    prod.setStock(stock);
                }
                productoRepo.guardar(prod);
                System.out.println("Producto modificado exitosamente.");
            } else {
                System.out.println("Error: Producto no encontrado o dado de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("Entrada invalida.");
        }
    }

    private static void bajaProducto() {
        System.out.print("Ingrese el ID del producto a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Producto> opt = productoRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                productoRepo.eliminarLogico(id);
                System.out.println("Producto '" + opt.get().getNombre() + "' dado de baja exitosamente.");
            } else {
                System.out.println("Error: Producto no encontrado o ya dado de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static boolean listarProductos() {
        List<Producto> activos = productoRepo.listarActivos();
        if (activos.isEmpty()) {
            System.out.println("No hay productos activos.");
            return false;
        }
        System.out.println("Productos activos:");
        for (Producto p : activos) {
            String catName = (p.getCategoria() != null) ? p.getCategoria().getNombre() : "Sin categoria";
            System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock() + " | Disponible: " + p.getDisponible() + " | Categoria: " + catName);
        }
        return true;
    }

    private static void menuUsuarios() {
        boolean volver = false;
        while (!volver) {
            System.out.println("--- ABM USUARIOS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            String opcion = scanner.nextLine();
            switch (opcion) {
                case "1": altaUsuario(); break;
                case "2": modificarUsuario(); break;
                case "3": bajaUsuario(); break;
                case "4": listarUsuarios(); break;
                case "5": buscarUsuarioPorMail(); break;
                case "0": volver = true; break;
                default: System.out.println("Opcion invalida.");
            }
        }
    }

    private static void altaUsuario() {
        System.out.print("Ingrese nombre: ");
        String nombre = scanner.nextLine();
        System.out.print("Ingrese apellido: ");
        String apellido = scanner.nextLine();
        System.out.print("Ingrese mail: ");
        String mail = scanner.nextLine();
        if (usuarioRepo.buscarPorMail(mail).isPresent()) {
            System.out.println("Error: el mail ya se encuentra en uso.");
            return;
        }
        System.out.print("Ingrese celular (opcional): ");
        String celular = scanner.nextLine();
        System.out.print("Ingrese contraseña: ");
        String contrasena = scanner.nextLine();
        System.out.print("Seleccione rol (1: ADMIN, 2: USUARIO): ");
        Rol rol = scanner.nextLine().equals("1") ? Rol.ADMIN : Rol.USUARIO;

        Usuario u = Usuario.builder().nombre(nombre).apellido(apellido).mail(mail)
                .celular(celular).contrasena(contrasena).rol(rol).build();
        u = usuarioRepo.guardar(u);
        System.out.println("Usuario creado exitosamente con ID: " + u.getId());
    }

    private static void modificarUsuario() {
        if (!listarUsuarios()) return;
        System.out.print("Ingrese el ID del usuario a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Usuario> opt = usuarioRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                Usuario u = opt.get();
                System.out.println("Valores actuales - Nombre: " + u.getNombre() + " " + u.getApellido() + ", Celular: " + u.getCelular());
                System.out.print("Nuevo nombre (dejar en blanco para mantener): ");
                String nombre = scanner.nextLine();
                if (!nombre.trim().isEmpty()) u.setNombre(nombre);
                System.out.print("Nuevo apellido (dejar en blanco para mantener): ");
                String apellido = scanner.nextLine();
                if (!apellido.trim().isEmpty()) u.setApellido(apellido);
                System.out.print("Nuevo celular (dejar en blanco para mantener): ");
                String celular = scanner.nextLine();
                if (!celular.trim().isEmpty()) u.setCelular(celular);
                System.out.print("Nueva contraseña (dejar en blanco para mantener): ");
                String contrasena = scanner.nextLine();
                if (!contrasena.trim().isEmpty()) u.setContrasena(contrasena);
                
                usuarioRepo.guardar(u);
                System.out.println("Usuario modificado exitosamente.");
            } else {
                System.out.println("Error: Usuario no encontrado o dado de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void bajaUsuario() {
        System.out.print("Ingrese el ID del usuario a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Usuario> opt = usuarioRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                usuarioRepo.eliminarLogico(id);
                System.out.println("Usuario '" + opt.get().getNombreCompleto() + "' dado de baja exitosamente.");
            } else {
                System.out.println("Error: No se encontro usuario activo con ese ID.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static boolean listarUsuarios() {
        List<Usuario> activos = usuarioRepo.listarActivos();
        if (activos.isEmpty()) {
            System.out.println("No hay usuarios activos.");
            return false;
        }
        System.out.println("Usuarios activos:");
        for (Usuario u : activos) {
            System.out.println("ID: " + u.getId() + " | Nombre: " + u.getNombreCompleto() + " | Mail: " + u.getMail() + " | Rol: " + u.getRol());
        }
        return true;
    }

    private static void buscarUsuarioPorMail() {
        System.out.print("Ingrese el mail a buscar: ");
        String mail = scanner.nextLine();
        Optional<Usuario> opt = usuarioRepo.buscarPorMail(mail);
        if (opt.isPresent()) {
            Usuario u = opt.get();
            System.out.println("Usuario encontrado:");
            System.out.println("ID: " + u.getId() + " | Nombre: " + u.getNombreCompleto() + " | Mail: " + u.getMail() + " | Celular: " + u.getCelular() + " | Rol: " + u.getRol());
        } else {
            System.out.println("No existe usuario activo con ese mail.");
        }
    }

    private static void menuPedidos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("--- GESTION DE PEDIDOS ---");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado");
            System.out.println("3. Baja logica");
            System.out.println("4. Listado");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            String opcion = scanner.nextLine();
            switch (opcion) {
                case "1": altaPedido(); break;
                case "2": cambiarEstadoPedido(); break;
                case "3": bajaPedido(); break;
                case "4": listarPedidos(); break;
                case "5": pedidosPorUsuario(); break;
                case "6": pedidosPorEstado(); break;
                case "0": volver = true; break;
                default: System.out.println("Opcion invalida.");
            }
        }
    }

    private static void altaPedido() {
        if (!listarUsuarios()) return;
        System.out.print("Seleccione el ID del usuario para el pedido: ");
        try {
            Long uid = Long.parseLong(scanner.nextLine());
            Optional<Usuario> optU = usuarioRepo.buscarPorId(uid);
            if (!optU.isPresent() || optU.get().isEliminado()) {
                System.out.println("Error: Usuario invalido o dado de baja.");
                return;
            }
            Usuario usuario = optU.get();
            
            System.out.println("Formas de Pago: 1. TARJETA, 2. TRANSFERENCIA, 3. EFECTIVO");
            System.out.print("Seleccione forma de pago: ");
            String fp = scanner.nextLine();
            FormaPago formaPago = fp.equals("1") ? FormaPago.TARJETA : fp.equals("2") ? FormaPago.TRANSFERENCIA : FormaPago.EFECTIVO;
            
            Pedido pedido = Pedido.builder()
                .fecha(LocalDate.now())
                .estado(Estado.PENDIENTE)
                .formaPago(formaPago)
                .build();
            
            boolean agregando = true;
            while (agregando) {
                if (!listarProductos()) {
                    System.out.println("No hay productos disponibles.");
                    break;
                }
                System.out.print("Seleccione ID del producto a agregar: ");
                Long pid = Long.parseLong(scanner.nextLine());
                Optional<Producto> optP = productoRepo.buscarPorId(pid);
                if (!optP.isPresent() || optP.get().isEliminado() || !optP.get().getDisponible()) {
                    System.out.println("Error: Producto invalido o no disponible.");
                    continue;
                }
                Producto p = optP.get();
                System.out.print("Ingrese cantidad: ");
                int cant = Integer.parseInt(scanner.nextLine());
                if (cant <= 0 || cant > p.getStock()) {
                    System.out.println("Error: Cantidad invalida o stock insuficiente (Stock actual: " + p.getStock() + ").");
                    continue;
                }
                
                pedido.addDetallePedido(cant, p);
                
                System.out.print("Desea agregar otro producto? (S/N): ");
                agregando = scanner.nextLine().trim().equalsIgnoreCase("S");
            }
            
            if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
                System.out.println("Error: El pedido debe tener al menos un detalle. Operacion cancelada.");
                return;
            }
            
            
            var em = JPAUtil.getEntityManagerFactory().createEntityManager();
            try {
                em.getTransaction().begin();
                Usuario usuarioBD = em.find(Usuario.class, usuario.getId());
                usuarioBD.addPedido(pedido);
                
                for (DetallePedido dp : pedido.getDetalles()) {
                    Producto prod = em.find(Producto.class, dp.getProducto().getId());
                    prod.setStock(prod.getStock() - dp.getCantidad());
                    dp.setProducto(prod);
                }
                
                em.persist(pedido);
                em.getTransaction().commit();
                
                System.out.println("Pedido generado exitosamente!");
                System.out.println("ID Pedido: " + pedido.getId() + " | Total: $" + pedido.getTotal() + " | Usuario: " + usuarioBD.getNombreCompleto());
                for (DetallePedido dp : pedido.getDetalles()) {
                    System.out.println(" - " + dp.getCantidad() + "x " + dp.getProducto().getNombre() + " (Subtotal: $" + dp.getSubtotal() + ")");
                }
            } catch (Exception e) {
                em.getTransaction().rollback();
                System.out.println("Error durante el alta de pedido. Transaccion revertida. " + e.getMessage());
            } finally {
                em.close();
            }
            
        } catch (NumberFormatException e) {
            System.out.println("Entrada invalida. Cancelando.");
        }
    }

    private static void cambiarEstadoPedido() {
        System.out.print("Ingrese el ID del pedido a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Pedido> opt = pedidoRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                Pedido p = opt.get();
                System.out.println("Estado actual: " + p.getEstado());
                System.out.println("Seleccione nuevo estado: 1. PENDIENTE, 2. CONFIRMADO, 3. TERMINADO, 4. CANCELADO");
                String est = scanner.nextLine();
                Estado nuevoEstado = est.equals("1") ? Estado.PENDIENTE : est.equals("2") ? Estado.CONFIRMADO : est.equals("3") ? Estado.TERMINADO : Estado.CANCELADO;
                p.setEstado(nuevoEstado);
                pedidoRepo.guardar(p);
                System.out.println("Estado de pedido ID " + p.getId() + " actualizado a " + nuevoEstado + ".");
            } else {
                System.out.println("Error: Pedido no encontrado o dado de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void bajaPedido() {
        System.out.print("Ingrese el ID del pedido a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Pedido> opt = pedidoRepo.buscarPorId(id);
            if (opt.isPresent() && !opt.get().isEliminado()) {
                pedidoRepo.eliminarLogico(id);
                System.out.println("Pedido ID " + id + " con total $" + opt.get().getTotal() + " dado de baja exitosamente.");
            } else {
                System.out.println("Error: Pedido no encontrado o ya dado de baja.");
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void listarPedidos() {
        List<Pedido> activos = pedidoRepo.listarActivos();
        if (activos.isEmpty()) {
            System.out.println("No hay pedidos activos.");
            return;
        }
        System.out.println("Pedidos activos:");
        for (Pedido p : activos) {
            String uname = "N/A";
            System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Forma Pago: " + p.getFormaPago() + " | Total: $" + p.getTotal());
        }
    }

    private static void pedidosPorUsuario() {
        if (!listarUsuarios()) return;
        System.out.print("Seleccione ID del usuario: ");
        try {
            Long uid = Long.parseLong(scanner.nextLine());
            List<Pedido> pedidos = usuarioRepo.buscarPedidosPorUsuario(uid);
            if (pedidos.isEmpty()) {
                System.out.println("La lista esta vacia. El usuario no tiene pedidos activos.");
            } else {
                for (Pedido p : pedidos) {
                    System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Total: $" + p.getTotal());
                }
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void pedidosPorEstado() {
        System.out.println("Seleccione estado a buscar: 1. PENDIENTE, 2. CONFIRMADO, 3. TERMINADO, 4. CANCELADO");
        String est = scanner.nextLine();
        Estado buscar = est.equals("1") ? Estado.PENDIENTE : est.equals("2") ? Estado.CONFIRMADO : est.equals("3") ? Estado.TERMINADO : Estado.CANCELADO;
        
        List<Pedido> pedidos = pedidoRepo.buscarPorEstado(buscar);
        if (pedidos.isEmpty()) {
            System.out.println("La lista esta vacia. No hay pedidos en ese estado.");
        } else {
            for (Pedido p : pedidos) {
                System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Total: $" + p.getTotal());
            }
        }
    }

    private static void menuReportes() {
        boolean volver = false;
        while (!volver) {
            System.out.println("--- REPORTES ---");
            System.out.println("1. Productos por categoria");
            System.out.println("2. Pedidos por usuario");
            System.out.println("3. Pedidos por estado");
            System.out.println("4. Total facturado");
            System.out.println("0. Volver");
            System.out.print("Seleccione una opcion: ");
            String opcion = scanner.nextLine();
            switch (opcion) {
                case "1": reporteProductosPorCategoria(); break;
                case "2": pedidosPorUsuario(); break;
                case "3": pedidosPorEstado(); break;
                case "4": totalFacturado(); break;
                case "0": volver = true; break;
                default: System.out.println("Opcion invalida.");
            }
        }
    }

    private static void reporteProductosPorCategoria() {
        if (!listarCategorias()) return;
        System.out.print("Ingrese el ID de la categoria para buscar productos: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            List<Producto> filtrados = categoriaRepo.buscarProductosPorCategoria(id);
            if (filtrados.isEmpty()) {
                System.out.println("No hay productos activos en esa categoria.");
            } else {
                System.out.println("Productos de la categoria con ID " + id + ":");
                for (Producto p : filtrados) {
                    System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock());
                }
            }
        } catch (NumberFormatException e) {
            System.out.println("ID invalido.");
        }
    }

    private static void totalFacturado() {
        List<Pedido> terminados = pedidoRepo.buscarPorEstado(Estado.TERMINADO);
        double total = terminados.stream().mapToDouble(p -> p.getTotal() != null ? p.getTotal() : 0.0).sum();
        if (terminados.isEmpty()) {
            System.out.println("Total facturado: $0.00");
        } else {
            System.out.println(String.format(Locale.US, "Total facturado: $%.2f", total));
        }
    }
}
