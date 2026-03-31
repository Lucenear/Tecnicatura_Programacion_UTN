package CasoIII;

public class PruebaEmpleados {
    public static void main(String[] args) {
        Empleado[] empleados = {
            new EmpleadoPlanta("Ana", 3000.0),
            new EmpleadoTemporal("Luis", 160.0, 20.0)
        };

        for (Empleado e : empleados) {
            System.out.println("Sueldo de " + e.nombre + ": " + e.calcularSueldo());

            if (e instanceof EmpleadoPlanta) {
                System.out.println(" -> Es empleado de planta");
            } else if (e instanceof EmpleadoTemporal) {
                System.out.println(" -> Es empleado temporal");
            }
        }
    }
}