package Ejercicio8;

public class main {
    public static void main(String[] args) {
        Usuario usuario = new Usuario("Elena Ruiz", "45678901");
        Documento doc = new Documento("Contrato de alquiler", "Contenido del contrato...", "HASH123", "2025-10-17", usuario);
        System.out.println("Ejercicio 8 - Documento creado:");
        System.out.println("Usuario: " + doc.getUsuario().getNombre());
        System.out.println("Firma hash: " + doc.getFirmaDigital().getCodigoHash());
    }
}