package CasoIII;

public class EmpleadoTemporal extends Empleado {
    private double horasTrabajadas;
    private double tarifaPorHora;

    public EmpleadoTemporal(String nombre, double horasTrabajadas, double tarifaPorHora) {
        super(nombre);
        this.horasTrabajadas = horasTrabajadas;
        this.tarifaPorHora = tarifaPorHora;
    }

    @Override
    public double calcularSueldo() {
        return horasTrabajadas * tarifaPorHora;
    }
}