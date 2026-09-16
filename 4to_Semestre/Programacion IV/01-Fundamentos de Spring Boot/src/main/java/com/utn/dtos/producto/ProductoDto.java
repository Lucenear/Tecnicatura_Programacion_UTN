package com.utn.dtos.producto;
public record ProductoDto(Long id, String nombre, Double precio, String descripcion, int stock, String imagen, Boolean disponible, com.utn.dtos.categoria.CategoriaDto categoria) {}
