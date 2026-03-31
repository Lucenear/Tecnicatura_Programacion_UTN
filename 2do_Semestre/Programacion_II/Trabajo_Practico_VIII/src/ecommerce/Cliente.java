package ecommerce;

public class Cliente implements Notificable {
    private String nombre;

    public Cliente(String nombre) {
        this.nombre = nombre;
    }

    public void recibirNotificacion(String mensaje) {
        System.out.println(nombre + ", tenemos novedades! " + mensaje);
    }

    @Override
    public void notificar() {
    }
}