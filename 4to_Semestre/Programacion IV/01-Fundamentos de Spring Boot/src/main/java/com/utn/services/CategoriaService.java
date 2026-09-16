package com.utn.services;

import com.utn.dtos.categoria.CategoriaCreate;
import com.utn.entities.Categoria;
import com.utn.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Categoria create(CategoriaCreate dto) {
        Categoria categoria = Categoria.builder()
                .nombre(dto.nombre())
                .descripcion(dto.descripcion())
                .build();
        return categoriaRepository.save(categoria);
    }
}
