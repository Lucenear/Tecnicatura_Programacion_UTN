package Ejercicio12;

public class main {
    public static void main(String[] args) {
        Contribuyente contribuyente = new Contribuyente("Miguel Angel", "20-11223344-5");
        Impuesto impuesto = new Impuesto(1000.0, contribuyente);
        Calculadora calc = new Calculadora();
        System.out.println("Ejercicio 12 - Calculo de impuesto:");
        calc.calcular(impuesto);
    }
}