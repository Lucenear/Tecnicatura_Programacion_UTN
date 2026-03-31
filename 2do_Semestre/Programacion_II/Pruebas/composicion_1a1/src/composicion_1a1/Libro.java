package composicion_1a1;

public class Libro {
    private String titulo;
    private Portada portada;
    
    public Libro (String titulo, String ilustracion) {
        this.titulo = titulo;
        this.portada = new Portada(ilustracion);
    }

    public void getPortada() {
        System.out.println("Libro: " + titulo + " tiene portada: " + portada.getIlustracion());
    }
}
