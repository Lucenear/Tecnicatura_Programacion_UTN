package CasoIV;

public class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public void hacerSonido() {
        System.out.println("El animal hace un sonido generico");
    }

    public void describirAnimal() {
        System.out.println("Este es un animal llamado " + nombre);
    }
}