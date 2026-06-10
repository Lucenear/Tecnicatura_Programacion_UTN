package com.tup.programacion3.entities;

import com.tup.programacion3.enums.Rol;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class Usuario extends Base {
    private String nombre;
    private String apellido;
    private String mail;
    private String celular;
    private String contrasena;
    private Rol rol;
    private Set<Pedido> pedidos = new HashSet<>();

    public Usuario(String nombre, String apellido, String mail, Rol rol) {
        super();
        this.nombre = nombre;
        this.apellido = apellido;
        this.mail = mail;
        this.rol = rol;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(getMail(), usuario.getMail());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getMail());
    }

    public void addPedido(Pedido pedido) { this.pedidos.add(pedido); }
    public int getCantidadPedidos() { return pedidos.size(); }
    public String getNombreCompleto() { return nombre + " " + apellido; }
    public Set<Pedido> getPedidos() { return pedidos; }
    public String getMail() { return mail; }

    @Override
    public String toString() {
        return "Usuario{" +
                "nombre='" + nombre + ' ' + apellido + '\'' +
                ", mail='" + mail + '\'' +
                ", pedidosCount=" + pedidos.size() +
                '}';
    }
}