package CasoPractico_III;

public class MainUniversidad {
    public static void main(String[] args) {
        Universidad uni = new Universidad("Universidad Nacional");

        Profesor prof1 = new Profesor("P1", "Dr. Lopez", "Matematicas");
        Profesor prof2 = new Profesor("P2", "Ing. Martinez", "Ingenieria");
        Profesor prof3 = new Profesor("P3", "Lic. Garcia", "Literatura");

        Curso c1 = new Curso("MAT101", "Calculo I");
        Curso c2 = new Curso("MAT102", "Algebra Lineal");
        Curso c3 = new Curso("ING201", "Mecanica");
        Curso c4 = new Curso("ING202", "Termodinamica");
        Curso c5 = new Curso("LIT301", "Literatura Hispanoamericana");

        uni.agregarProfesor(prof1);
        uni.agregarProfesor(prof2);
        uni.agregarProfesor(prof3);

        uni.agregarCurso(c1);
        uni.agregarCurso(c2);
        uni.agregarCurso(c3);
        uni.agregarCurso(c4);
        uni.agregarCurso(c5);

        uni.asignarProfesorACurso("MAT101", "P1");
        uni.asignarProfesorACurso("MAT102", "P1");
        uni.asignarProfesorACurso("ING201", "P2");
        uni.asignarProfesorACurso("ING202", "P2");
        uni.asignarProfesorACurso("LIT301", "P3");

        System.out.println("Cursos con profesor:");
        uni.listarCursos();
        System.out.println("\nProfesores con cursos:");
        for (Profesor p : uni.getProfesores()) {
            p.listarCursos();
        }

        System.out.println("\nCambiar profesor de MAT101 a P2:");
        uni.asignarProfesorACurso("MAT101", "P2");
        uni.listarCursos();

        System.out.println("\nEliminar ING202:");
        uni.eliminarCurso("ING202");
        uni.listarCursos();
        prof2.listarCursos();

        System.out.println("\nEliminar profesor P3:");
        uni.eliminarProfesor("P3");
        uni.listarCursos();

        System.out.println();
        uni.reporteCursosPorProfesor();
    }
}