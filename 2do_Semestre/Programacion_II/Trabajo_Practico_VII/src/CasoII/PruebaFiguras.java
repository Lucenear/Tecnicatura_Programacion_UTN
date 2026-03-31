package CasoII;

public class PruebaFiguras {
    public static void main(String[] args) {
        Figura[] figuras = {
            new Circulo(3.0),
            new Rectangulo(4.0, 5.0)
        };

        for (Figura f : figuras) {
            System.out.println(f.nombre + " - Area: " + f.calcularArea());
        }
    }
}