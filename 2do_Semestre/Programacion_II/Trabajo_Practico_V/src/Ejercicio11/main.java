package Ejercicio11;

public class main {
    public static void main(String[] args) {
        Artista artista = new Artista("The Beatles", "Rock");
        Cancion cancion = new Cancion("Hey Jude", artista);
        Reproductor reproductor = new Reproductor();
        System.out.println("Ejercicio 11 - Reproduccion:");
        reproductor.reproducir(cancion);
    }
}