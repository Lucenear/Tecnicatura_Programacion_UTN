package trabajo_practico_iv;

public class Empleado {
    private int id;
    private String nombre;
    private String puesto;
    private double salario;
    private static int totalEmpleados = 0;

    public Empleado(int id, String nombre, String puesto, double salario) {
        this.id = id;
        this.nombre = nombre;
        this.puesto = puesto;
        this.salario = salario;
        totalEmpleados++;
    }

    public Empleado(String nombre, String puesto) {
        this.id = totalEmpleados + 1;
        this.nombre = nombre;
        this.puesto = puesto;
        this.salario = 2000000.0;
        totalEmpleados++;
    }

    public void actualizarSalario(int porcentaje) {
        if (porcentaje < 0) {
            System.out.println("ERROR: El porcentaje no puede ser negativo");
            return;
        }
        double aumento = this.salario * porcentaje / 100.0;
        this.salario += aumento;
        System.out.println("Salario actualizado con un " + porcentaje + "% de aumento");
    }

    public void actualizarSalario(double cantidadFija) {
        if (cantidadFija < 0) {
            System.out.println("ERROR: La cantidad fija no puede ser negativa");
            return;
        }
        this.salario += cantidadFija;
        System.out.println("Salario actualizado con un aumento fijo de $" + cantidadFija);
    }

    @Override
    public String toString() {
        return "Empleado{id=" + id +
                ", nombre='" + nombre + '\'' +
                ", puesto='" + puesto + '\'' +
                ", salario=$" + String.format("%.2f", salario) + '}';
    }

    public static int mostrarTotalEmpleados() {
        return totalEmpleados;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPuesto() {
        return puesto;
    }

    public void setPuesto(String puesto) {
        this.puesto = puesto;
    }

    public double getSalario() {
        return salario;
    }

    public void setSalario(double salario) {
        this.salario = salario;
    }
}