package CasoI;

public class Auto extends Vehiculo {
    private int cantidadPuertas;

    public Auto(String marca, String modelo, int cantidadPuertas) {
        super(marca, modelo);
        this.cantidadPuertas = cantidadPuertas;
    }

    @Override
    public void mostrarInfo() {
        super.mostrarInfo();
        System.out.println("Cantidad de puertas: " + cantidadPuertas);
    }

    public static void main(String[] args) {
        Auto auto = new Auto("Toyota", "Corolla", 4);
        auto.mostrarInfo();
    }
}