package com.utn.dtos.detallePedido;
public record DetallePedidoDto(Long id, int cantidad, Double subtotal, com.utn.dtos.producto.ProductoDto producto) {}
