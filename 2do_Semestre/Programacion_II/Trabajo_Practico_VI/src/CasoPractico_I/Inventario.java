package CasoPractico_I;

import java.util.*;

public class Inventario {
    private ArrayList<Producto> productos;

    public Inventario() {
        this.productos = new ArrayList<>();
    }

    public void agregarProducto(Producto p) {
        productos.add(p);
    }

    public void listarProductos() {
        if (productos.isEmpty()) {
            System.out.println("Inventario vacio.");
            return;
        }
        for (Producto p : productos) {
            p.mostrarInfo();
        }
    }

    public Producto buscarProductoPorId(String id) {
        for (Producto p : productos) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
    }

    public boolean eliminarProducto(String id) {
        return productos.removeIf(p -> p.getId().equals(id));
    }

    public boolean actualizarStock(String id, int nuevaCantidad) {
    Producto p = buscarProductoPorId(id);
    if (p != null) {
        p.setCantidad(nuevaCantidad); // Actualizo stock
        return true;
    }
    return false;
}

    public ArrayList<Producto> filtrarPorCategoria(CategoriaProducto categoria) {
        ArrayList<Producto> resultado = new ArrayList<>();
        for (Producto p : productos) {
            if (p.getCategoria() == categoria) {
                resultado.add(p);
            }
        }
        return resultado;
    }

    public int obtenerTotalStock() {
        int total = 0;
        for (Producto p : productos) {
            total += p.getCantidad();
        }
        return total;
    }

    public Producto obtenerProductoConMayorStock() {
        if (productos.isEmpty()) return null;
        Producto max = productos.get(0);
        for (Producto p : productos) {
            if (p.getCantidad() > max.getCantidad()) {
                max = p;
            }
        }
        return max;
    }

    public ArrayList<Producto> filtrarProductosPorPrecio(double min, double max) {
        ArrayList<Producto> resultado = new ArrayList<>();
        for (Producto p : productos) {
            if (p.getPrecio() >= min && p.getPrecio() <= max) {
                resultado.add(p);
            }
        }
        return resultado;
    }

    public void mostrarCategoriasDisponibles() {
        System.out.println("Categorias disponibles:");
        for (CategoriaProducto cat : CategoriaProducto.values()) {
            System.out.println("- " + cat + ": " + cat.getDescripcion());
        }
    }
}