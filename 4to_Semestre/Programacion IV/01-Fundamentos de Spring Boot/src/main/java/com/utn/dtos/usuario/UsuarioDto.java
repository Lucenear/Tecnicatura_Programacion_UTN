package com.utn.dtos.usuario;
import com.utn.enums.Rol;
public record UsuarioDto(Long id, String nombre, String apellido, String mail, String celular, Rol rol) {}
