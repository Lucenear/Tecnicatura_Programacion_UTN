package com.utn.dtos.producto;
public record ProductoCreate(String nombre, Double precio, String descripcion, int stock, String imagen, Boolean disponible, Long categoriaId) {}
