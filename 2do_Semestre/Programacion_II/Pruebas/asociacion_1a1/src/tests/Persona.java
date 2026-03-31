package tests;

public class Persona {
    private String nombre;
    private Pasaporte pasaporte;
    
    public Persona(String nombre) {
        this.nombre = nombre;
    }
    
    public void setPasaporte(Pasaporte pasaporte) { 
        this.pasaporte = pasaporte;
    }
    
    public void mostrarPasaporte() {
        if (pasaporte != null) { 
            System.out.println(nombre + " tiene pasaporte con numero: " + pasaporte.getNumero());
        }
        else {
            System.out.println(nombre + " no tiene pasaporte");
        }
    }
    
}
