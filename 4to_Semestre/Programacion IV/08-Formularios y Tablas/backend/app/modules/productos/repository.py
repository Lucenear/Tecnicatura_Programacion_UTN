from typing import List
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.productos.models import Producto

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get_by_categoria(self, categoria_id: int) -> List[Producto]:
        statement = select(Producto).where(Producto.categoria_id == categoria_id)
        return list(self.session.exec(statement).all())
