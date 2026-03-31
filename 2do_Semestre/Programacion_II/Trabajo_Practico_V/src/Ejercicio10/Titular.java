package Ejercicio10;

public class Titular {
    private String nombre;
    private String dni;

    public Titular(String nombre, String dni) {
        this.nombre = nombre;
        this.dni = dni;
    }

    public String getNombre() { return nombre; }
    public String getDni() { return dni; }
}