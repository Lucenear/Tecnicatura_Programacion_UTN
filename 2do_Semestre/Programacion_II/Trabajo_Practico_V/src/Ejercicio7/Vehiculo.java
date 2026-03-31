package Ejercicio7;

public class Vehiculo {
    private String patente;
    private String modelo;
    private Motor motor;
    private Conductor conductor;

    public Vehiculo(String patente, String modelo, Motor motor, Conductor conductor) {
        this.patente = patente;
        this.modelo = modelo;
        this.motor = motor;
        this.conductor = conductor;
    }

    public Motor getMotor() { return motor; }
    public Conductor getConductor() { return conductor; }
    public String getPatente() { return patente; }
    public String getModelo() { return modelo; }
}