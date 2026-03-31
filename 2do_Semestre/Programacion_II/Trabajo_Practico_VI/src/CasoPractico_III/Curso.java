package CasoPractico_III;

public class Curso {
    private String codigo;
    private String nombre;
    private Profesor profesor;

    public Curso(String codigo, String nombre) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.profesor = null;
    }

    public void setProfesor(Profesor p) {
        if (this.profesor != null) {
            this.profesor.eliminarCurso(this);
        }
        this.profesor = p;
        if (p != null) {
            p.agregarCurso(this);
        }
    }

    public void mostrarInfo() {
        String prof = (profesor != null) ? profesor.getNombre() : "Sin asignar";
        System.out.println("Curso{codigo='" + codigo + "', nombre='" + nombre + "', profesor='" + prof + "'}");
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public Profesor getProfesor() {
        return profesor;
    }
}