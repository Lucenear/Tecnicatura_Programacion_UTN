from typing import List, Optional
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.pedidos.models import Pedido, DetallePedido

class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_activos(self) -> List[Pedido]:
        statement = select(Pedido).where(Pedido.deleted_at == None)
        return list(self.session.exec(statement).all())

    def get_by_id_activo(self, id: int) -> Optional[Pedido]:
        statement = select(Pedido).where(Pedido.id == id, Pedido.deleted_at == None)
        return self.session.exec(statement).first()

class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session):
        super().__init__(session, DetallePedido)

    def get_by_pedido_id(self, pedido_id: int) -> List[DetallePedido]:
        statement = select(DetallePedido).where(DetallePedido.pedido_id == pedido_id)
        return list(self.session.exec(statement).all())
