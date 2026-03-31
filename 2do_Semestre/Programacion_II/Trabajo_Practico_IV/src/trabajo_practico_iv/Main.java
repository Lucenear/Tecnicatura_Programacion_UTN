package trabajo_practico_iv;

public class Main {
    public static void main(String[] args) {
 
        Empleado emp1 = new Empleado(100, "Romina Cortes", "QA", 1850000.0);
        Empleado emp2 = new Empleado("Carlos Guerra", "UX");
        Empleado emp3 = new Empleado("Lucia Sanchez", "Dev");

        System.out.println(emp1);
        System.out.println(emp2);
        System.out.println(emp3);
        System.out.println();

        emp1.actualizarSalario(10);
        emp2.actualizarSalario(90000.0);
        System.out.println();

        System.out.println(emp1);
        System.out.println(emp2);
        System.out.println(emp3);
        System.out.println();

        System.out.println("Total de empleados creados: " + Empleado.mostrarTotalEmpleados());
    }
}