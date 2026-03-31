package Ejercicio8;

public class Documento {
    private String titulo;
    private String contenido;
    private FirmaDigital firmaDigital;
    private Usuario usuario;

    public Documento(String titulo, String contenido, String hash, String fechaFirma, Usuario usuario) {
        this.titulo = titulo;
        this.contenido = contenido;
        this.firmaDigital = new FirmaDigital(hash, fechaFirma);
        this.usuario = usuario;
    }

    public FirmaDigital getFirmaDigital() { return firmaDigital; }
    public Usuario getUsuario() { return usuario; }
    public String getTitulo() { return titulo; }
    public String getContenido() { return contenido; }
}