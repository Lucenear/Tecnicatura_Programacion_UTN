from app.core.unit_of_work import BaseUnitOfWork
from app.modules.pedidos.repository import PedidoRepository, DetallePedidoRepository
from app.modules.productos.repository import ProductoRepository

class PedidoUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.pedidos = PedidoRepository(self.session)
        self.detalles = DetallePedidoRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
