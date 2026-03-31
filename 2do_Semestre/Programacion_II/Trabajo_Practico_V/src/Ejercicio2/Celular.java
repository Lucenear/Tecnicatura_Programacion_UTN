package Ejercicio2;

public class Celular {
    private String imei;
    private String marca;
    private Bateria bateria;
    private Usuario usuario;

    public Celular(String imei, String marca, Bateria bateria, Usuario usuario) {
        this.imei = imei;
        this.marca = marca;
        this.bateria = bateria;
        this.usuario = usuario;
    }

    public Bateria getBateria() { return bateria; }
    public Usuario getUsuario() { return usuario; }
    public String getImei() { return imei; }
    public String getMarca() { return marca; }
}