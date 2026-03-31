package CasoPractico_I;

public class MainStock {
    public static void main(String[] args) {
        Inventario inventario = new Inventario();

        // Creo productos
        inventario.agregarProducto(new Producto("P001", "Arroz", 800, 50, CategoriaProducto.ALIMENTOS));
        inventario.agregarProducto(new Producto("P002", "Laptop", 25000, 10, CategoriaProducto.ELECTRONICA));
        inventario.agregarProducto(new Producto("P003", "Camisa", 3000, 30, CategoriaProducto.ROPA));
        inventario.agregarProducto(new Producto("P004", "Lampara", 2500, 20, CategoriaProducto.HOGAR));
        inventario.agregarProducto(new Producto("P005", "Queso", 1200, 40, CategoriaProducto.ALIMENTOS));

        //Listo productos
        System.out.println("Lista de todos los productos");
        inventario.listarProductos();

        // Busco por ID
        System.out.println("\nBusqueda por ID P002");
        Producto p = inventario.buscarProductoPorId("P002");
        if (p != null) p.mostrarInfo();

        // Filtro por categoria
        System.out.println("\nProductos de ELECTRONICA");
        for (Producto prod : inventario.filtrarPorCategoria(CategoriaProducto.ELECTRONICA)) {
            prod.mostrarInfo();
        }

        //Elimino producto P005
        inventario.eliminarProducto("P005");
        System.out.println("\nLista despues de eliminar P005");
        inventario.listarProductos();

        // Actualizo stock P003
        Producto p003 = inventario.buscarProductoPorId("P003");
        if (p003 != null) {
            p003.setCantidad(25);
        }

        //Stock total
        System.out.println("\nStock total de productos: " + inventario.obtenerTotalStock());

        //Producto con mayor stock
        System.out.println("\nProducto con mayor stock:");
        Producto max = inventario.obtenerProductoConMayorStock();
        if (max != null) max.mostrarInfo();

        // Filtro por X precio
        System.out.println("\nProductos entre $1000 y $3000");
        for (Producto prod : inventario.filtrarProductosPorPrecio(1000, 3000)) {
            prod.mostrarInfo();
        }

        //Muestro categorias disponibles
        System.out.println();
        inventario.mostrarCategoriasDisponibles();
    }
}