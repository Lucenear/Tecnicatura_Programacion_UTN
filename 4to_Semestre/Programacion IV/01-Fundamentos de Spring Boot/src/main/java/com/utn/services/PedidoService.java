package com.utn.services;

import com.utn.dtos.pedido.PedidoDto;
import com.utn.dtos.detallePedido.DetallePedidoCreate;
import com.utn.entities.Pedido;
import com.utn.entities.Producto;
import com.utn.entities.Usuario;
import com.utn.repositories.PedidoRepository;
import com.utn.repositories.ProductoRepository;
import com.utn.repositories.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public Pedido createFromDto(Long usuarioId, PedidoDto dto, List<DetallePedidoCreate> detallesCreate) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        
        Pedido pedido = Pedido.builder()
                .fecha(dto.fecha())
                .estado(dto.estado())
                .formaPago(dto.formaPago())
                .build();
                
        for (DetallePedidoCreate detDto : detallesCreate) {
            Producto producto = productoRepository.findById(detDto.productoId()).orElseThrow();
            pedido.addDetallePedido(detDto.cantidad(), producto);
        }
        
        usuario.addPedido(pedido);
        return pedidoRepository.save(pedido);
    }
}
