package CasoIII;

public class EmpleadoPlanta extends Empleado {
    private double sueldoBasico;

    public EmpleadoPlanta(String nombre, double sueldoBasico) {
        super(nombre);
        this.sueldoBasico = sueldoBasico;
    }

    @Override
    public double calcularSueldo() {
        return sueldoBasico;
    }
}