package CasoIV;

public class PruebaAnimales {
    public static void main(String[] args) {
        Animal[] animales = {
            new Perro("Firulais"),
            new Gato("Michi"),
            new Vaca("Lola")
        };

        for (Animal a : animales) {
            a.describirAnimal();
            a.hacerSonido();
            System.out.println();
        }
    }
}