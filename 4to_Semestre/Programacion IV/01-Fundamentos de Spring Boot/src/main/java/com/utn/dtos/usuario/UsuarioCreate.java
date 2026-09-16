package com.utn.dtos.usuario;
import com.utn.enums.Rol;
public record UsuarioCreate(String nombre, String apellido, String mail, String celular, String contrasena, Rol rol) {}
