package Ejercicio13;

public class GeneradorQR {
    public void generar(String valor, Usuario usuario) {
        CodigoQR qr = new CodigoQR(valor);
        System.out.println("Código QR generado para " + usuario.getNombre() + ": " + qr.getValor());
    }
}