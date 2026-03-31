package Ejercicio12;

public class Calculadora {
    public void calcular(Impuesto impuesto) {
        double total = impuesto.getMonto() * 1.21;
        System.out.println("Total a pagar: $" + total);
    }
}