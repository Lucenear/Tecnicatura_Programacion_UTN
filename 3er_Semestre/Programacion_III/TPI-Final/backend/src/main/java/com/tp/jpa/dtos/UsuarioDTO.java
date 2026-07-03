package com.tp.jpa.dtos;

import com.tp.jpa.model.Usuario;
import java.time.LocalDateTime;

public record UsuarioDTO(
    Long id,
    boolean eliminado,
    LocalDateTime createdAt,
    String nombre,
    String apellido,
    String mail,
    String celular
) {
    public static UsuarioDTO fromUsuario(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return new UsuarioDTO(
            usuario.getId(),
            usuario.isEliminado(),
            usuario.getCreatedAt(),
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getMail(),
            usuario.getCelular()
        );
    }
}
