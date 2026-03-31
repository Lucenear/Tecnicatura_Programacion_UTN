package Ejercicio1;

public class Pasaporte {
    private String numero;
    private String fechaEmision;
    private Foto foto;
    private Titular titular;

    public Pasaporte(String numero, String fechaEmision, String imagen, String formato, Titular titular) {
        this.numero = numero;
        this.fechaEmision = fechaEmision;
        this.foto = new Foto(imagen, formato); // Composición
        this.titular = titular;
    }

    public Foto getFoto() { return foto; }
    public Titular getTitular() { return titular; }
    public String getNumero() { return numero; }
    public String getFechaEmision() { return fechaEmision; }
}