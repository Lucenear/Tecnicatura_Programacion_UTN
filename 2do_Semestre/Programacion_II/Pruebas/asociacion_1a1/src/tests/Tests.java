package tests;

public class Tests {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Persona persona = new Persona ("Gustavo Farias");
        Pasaporte pasaporte = new Pasaporte ("A33924737");
        
        persona.setPasaporte(pasaporte);

        persona.mostrarPasaporte();
        
        Persona persona1 = new Persona("Cecilia Cortes");
        
        persona1.mostrarPasaporte();
        
    } 
    
    
}
