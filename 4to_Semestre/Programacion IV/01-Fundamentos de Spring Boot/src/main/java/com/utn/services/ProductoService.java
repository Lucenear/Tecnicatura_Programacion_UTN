package com.utn.services;

import com.utn.dtos.producto.ProductoCreate;
import com.utn.entities.Categoria;
import com.utn.entities.Producto;
import com.utn.repositories.CategoriaRepository;
import com.utn.repositories.ProductoRepository;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Producto create(ProductoCreate dto) {
        Categoria categoria = null;
        if (dto.categoriaId() != null) {
            categoria = categoriaRepository.findById(dto.categoriaId()).orElse(null);
        }
        Producto producto = Producto.builder()
                .nombre(dto.nombre())
                .precio(dto.precio())
                .descripcion(dto.descripcion())
                .stock(dto.stock())
                .imagen(dto.imagen())
                .disponible(dto.disponible() != null ? dto.disponible() : true)
                .categoria(categoria)
                .build();
        return productoRepository.save(producto);
    }
}
