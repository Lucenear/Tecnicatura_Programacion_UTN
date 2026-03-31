package composicion_1a1;

public class Composicion_1a1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Libro pinocho = new Libro("Pinocho", "Un muneco de madera"); 
        pinocho.getPortada();
        pinocho = null;
    }
    
}
