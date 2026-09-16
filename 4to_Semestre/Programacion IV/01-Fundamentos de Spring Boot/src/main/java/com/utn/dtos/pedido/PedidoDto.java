package com.utn.dtos.pedido;
import com.utn.enums.Estado;
import com.utn.enums.FormaPago;
import com.utn.dtos.detallePedido.DetallePedidoDto;
import java.time.LocalDate;
import java.util.List;
public record PedidoDto(Long id, LocalDate fecha, Double total, Estado estado, FormaPago formaPago, List<DetallePedidoDto> detalles) {}
