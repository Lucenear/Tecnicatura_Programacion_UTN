package Ejercicio14;

public class EditorVideo {
    public void exportar(String formato, Proyecto proyecto) {
        Render render = new Render(formato);
        System.out.println("Exportando proyecto '" + proyecto.getNombre() + "' en formato " + render.getFormato());
    }
}