package com.utn.services;

import com.utn.dtos.usuario.UsuarioCreate;
import com.utn.entities.Usuario;
import com.utn.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario create(UsuarioCreate dto) {
        Usuario usuario = Usuario.builder()
                .nombre(dto.nombre())
                .apellido(dto.apellido())
                .mail(dto.mail())
                .celular(dto.celular())
                .contrasena(dto.contrasena())
                .rol(dto.rol())
                .build();
        return usuarioRepository.save(usuario);
    }
}
