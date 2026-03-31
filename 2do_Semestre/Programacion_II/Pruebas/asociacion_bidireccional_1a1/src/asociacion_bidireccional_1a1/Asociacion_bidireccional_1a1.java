/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package asociacion_bidireccional_1a1;

/**
 *
 * @author lucenear
 */
public class Asociacion_bidireccional_1a1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        Matricula matricula = new Matricula("AB1234");
        Coche etios = new Coche("Etios");
        
        etios.setMatricula(matricula);
        System.out.println("La matricula " + matricula.getNumero());
        System.out.println("El auto " + etios.getModelo());
        System.out.println("Matricula asociada al coche es: " + etios.getMatricula().getNumero());
        System.out.println("El auto asociado a la matricula es: " + etios.getModelo());
    }
    
}
