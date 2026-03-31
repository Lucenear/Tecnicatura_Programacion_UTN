package Ejercicio7;

public class main {
    public static void main(String[] args) {
        Conductor conductor = new Conductor("Roberto Sanchez", "LIC-98765");
        Motor motor = new Motor("V8", "MOT-123456");
        Vehiculo auto = new Vehiculo("ABC123", "Ford Mustang", motor, conductor);
        System.out.println("Ejercicio 7 - Vehiculo creado:");
        System.out.println("Conductor: " + auto.getConductor().getNombre());
        System.out.println("Motor: " + auto.getMotor().getTipo());
    }
}