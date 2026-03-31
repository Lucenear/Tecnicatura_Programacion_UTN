package CasoPractico_III;

import java.util.*;

public class Profesor {
    private String id;
    private String nombre;
    private String especialidad;
    private List<Curso> cursos;

    public Profesor(String id, String nombre, String especialidad) {
        this.id = id;
        this.nombre = nombre;
        this.especialidad = especialidad;
        this.cursos = new ArrayList<>();
    }

    public void agregarCurso(Curso c) {
        if (!cursos.contains(c)) {
            cursos.add(c);
//            c.setProfesor(this); // Me arroja error en bucle
        }
    }

    public void eliminarCurso(Curso c) {
        if (cursos.remove(c)) {
//            c.setProfesor(null); // Mismo error de bucle
        }
    }

    public void listarCursos() {
        System.out.println("Cursos de " + nombre + ":");
        for (Curso c : cursos) {
            System.out.println("- " + c.getCodigo() + ": " + c.getNombre());
        }
    }

    public void mostrarInfo() {
        System.out.println("Profesor{id='" + id + "', nombre='" + nombre + "', especialidad='" + especialidad + "', cursos=" + cursos.size() + "}");
    }

    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public List<Curso> getCursos() {
        return new ArrayList<>(cursos);
    }
}