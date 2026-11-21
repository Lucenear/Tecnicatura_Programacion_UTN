from typing import List, Optional
from datetime import datetime, timezone
from app.modules.pedidos.models import Pedido, DetallePedido
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoEstadoUpdate,
    PedidoRead,
    DetallePedidoRead,
)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork

class PedidoNoEncontrado(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"Pedido con id {id} no encontrado")

class ProductoNoEncontrado(Exception):
    def __init__(self, producto_id: int):
        self.producto_id = producto_id
        super().__init__(f"Producto con id {producto_id} no encontrado")

class EstadoTerminalError(Exception):
    def __init__(self, estado: str):
        self.estado = estado
        super().__init__(f"No se puede modificar un pedido en estado terminal {estado}")

class PedidoService:
    def __init__(self, uow: Optional[PedidoUnitOfWork] = None):
        self.uow = uow or PedidoUnitOfWork()

    def get_all(self) -> List[PedidoRead]:
        with self.uow as uow:
            pedidos = uow.pedidos.get_activos()
            resultado = []
            for p in pedidos:
                detalles = uow.detalles.get_by_pedido_id(p.id)
                detalles_read = [
                    DetallePedidoRead(
                        pedido_id=d.pedido_id,
                        producto_id=d.producto_id,
                        cantidad=d.cantidad,
                        precio_unitario=d.precio_unitario,
                        subtotal=d.cantidad * d.precio_unitario,
                    )
                    for d in detalles
                ]
                resultado.append(
                    PedidoRead(
                        id=p.id,
                        fecha=p.fecha,
                        estado=p.estado,
                        total=p.total,
                        deleted_at=p.deleted_at,
                        detalles=detalles_read,
                    )
                )
            return resultado

    def get_by_id(self, id: int) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(id)
            if not pedido:
                raise PedidoNoEncontrado(id)
            detalles = uow.detalles.get_by_pedido_id(pedido.id)
            detalles_read = [
                DetallePedidoRead(
                    pedido_id=d.pedido_id,
                    producto_id=d.producto_id,
                    cantidad=d.cantidad,
                    precio_unitario=d.precio_unitario,
                    subtotal=d.cantidad * d.precio_unitario,
                )
                for d in detalles
            ]
            return PedidoRead(
                id=pedido.id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                deleted_at=pedido.deleted_at,
                detalles=detalles_read,
            )

    def crear(self, data: PedidoCreate, usuario_id: Optional[int] = None) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.create(Pedido(estado="PENDIENTE", total=0.0, usuario_id=usuario_id))
            total = 0.0
            for item in data.detalles:
                producto = uow.productos.get_by_id(item.producto_id)
                if producto is None:
                    raise ProductoNoEncontrado(item.producto_id)
                uow.detalles.create(
                    DetallePedido(
                        pedido_id=pedido.id,
                        producto_id=producto.id,
                        cantidad=item.cantidad,
                        precio_unitario=producto.precio_base,
                    )
                )
                total += item.cantidad * producto.precio_base

            pedido.total = total
            uow.pedidos.update(pedido)

            detalles = uow.detalles.get_by_pedido_id(pedido.id)
            detalles_read = [
                DetallePedidoRead(
                    pedido_id=d.pedido_id,
                    producto_id=d.producto_id,
                    cantidad=d.cantidad,
                    precio_unitario=d.precio_unitario,
                    subtotal=d.cantidad * d.precio_unitario,
                )
                for d in detalles
            ]
            return PedidoRead(
                id=pedido.id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                deleted_at=pedido.deleted_at,
                detalles=detalles_read,
            )

    def actualizar_estado(self, id: int, data: PedidoEstadoUpdate) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(id)
            if not pedido:
                raise PedidoNoEncontrado(id)

            if pedido.estado in ("ENTREGADO", "CANCELADO"):
                raise EstadoTerminalError(pedido.estado)

            pedido.estado = data.estado
            uow.pedidos.update(pedido)

            detalles = uow.detalles.get_by_pedido_id(pedido.id)
            detalles_read = [
                DetallePedidoRead(
                    pedido_id=d.pedido_id,
                    producto_id=d.producto_id,
                    cantidad=d.cantidad,
                    precio_unitario=d.precio_unitario,
                    subtotal=d.cantidad * d.precio_unitario,
                )
                for d in detalles
            ]
            return PedidoRead(
                id=pedido.id,
                fecha=pedido.fecha,
                estado=pedido.estado,
                total=pedido.total,
                deleted_at=pedido.deleted_at,
                detalles=detalles_read,
            )

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id_activo(id)
            if not pedido:
                raise PedidoNoEncontrado(id)
            pedido.deleted_at = datetime.now(timezone.utc)
            uow.pedidos.update(pedido)
