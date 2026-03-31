package CasoPractico_I;

public class Producto {
    private String id;
    private String nombre;
    private double precio;
    private int cantidad;
    private CategoriaProducto categoria;

    public Producto(String id, String nombre, double precio, int cantidad, CategoriaProducto categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }

    public void mostrarInfo() {
        System.out.println(this);
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public String getId() { return id; }
    public double getPrecio() { return precio; }
    public int getCantidad() { return cantidad; }
    public CategoriaProducto getCategoria() { return categoria; }

    @Override
    public String toString() {
        return "Producto{id='" + id + "', nombre='" + nombre + "', precio=" + precio +
               ", cantidad=" + cantidad + ", categoria=" + categoria + "}";
    }
}