package CasoII;

public class Rectangulo extends Figura {
    private double ancho;
    private double alto;

    public Rectangulo(double ancho, double alto) {
        super("Rectangulo");
        this.ancho = ancho;
        this.alto = alto;
    }

    @Override
    public double calcularArea() {
        return ancho * alto;
    }
}