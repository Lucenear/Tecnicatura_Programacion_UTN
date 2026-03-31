/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package asociacion_bidireccional_1a1;

import java.util.HashSet;

/**
 *
 * @author lucenear
 */
public class Matricula {
    private String numero;
    private Coche coche;
    
    public Matricula(String numero) {
        this.numero = numero;
    }

    public String getNumero() {
        return numero;
    }

    public void setCoche(Coche coche) {
        this.coche = coche;
        if (coche != null && coche.getMatricula() != this) {
            coche.setMatricula(this);
        }
    }

    public Coche getCoche() {
        return coche;
    }
    
}
