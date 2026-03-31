package Ejercicio14;

public class main {
    public static void main(String[] args) {
        Proyecto proyecto = new Proyecto("Video Institucional", 120);
        EditorVideo editor = new EditorVideo();
        System.out.println("Ejercicio 14 - Exportacion de video:");
        editor.exportar("MP4", proyecto);
    }
}