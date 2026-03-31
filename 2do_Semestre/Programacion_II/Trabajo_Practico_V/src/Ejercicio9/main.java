package Ejercicio9;

public class main {
    public static void main(String[] args) {
        Paciente paciente = new Paciente("Diego Torres", "OSDE");
        Profesional medico = new Profesional("Dra. Laura Mendez", "Cardiologia");
        CitaMedica cita = new CitaMedica("2025-11-05", "10:00", paciente, medico);
        System.out.println("Ejercicio 9 - Cita medica creada:");
        System.out.println("Paciente: " + cita.getPaciente().getNombre());
        System.out.println("Profesional: " + cita.getProfesional().getNombre());
    }
}