package com.utn.dtos.pedido;
import com.utn.enums.Estado;
import com.utn.enums.FormaPago;
public record PedidoEdit(Long id, Estado estado, FormaPago formaPago) {}
