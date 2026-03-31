package Ejercicio7;

public class Motor {
    private String tipo;
    private String numeroSerie;

    public Motor(String tipo, String numeroSerie) {
        this.tipo = tipo;
        this.numeroSerie = numeroSerie;
    }

    public String getTipo() { return tipo; }
    public String getNumeroSerie() { return numeroSerie; }
}