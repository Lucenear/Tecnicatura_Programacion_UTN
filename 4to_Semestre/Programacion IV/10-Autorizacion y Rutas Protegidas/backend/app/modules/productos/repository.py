from typing import List, Optional
from sqlmodel import Session, select
from app.core.repository import BaseRepository
from app.modules.productos.models import Producto, ProductoCategoria

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def get_all(self, include_deleted: bool = False) -> List[Producto]:
        statement = select(Producto)
        if not include_deleted:
            statement = statement.where(Producto.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

    def get_by_id(self, id: int, include_deleted: bool = False) -> Optional[Producto]:
        producto = self.session.get(Producto, id)
        if producto and not include_deleted and producto.deleted_at is not None:
            return None
        return producto

    def get_by_categoria(self, categoria_id: int, include_deleted: bool = False) -> List[Producto]:
        statement = select(Producto).where(Producto.categoria_id == categoria_id)
        if not include_deleted:
            statement = statement.where(Producto.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

    def sincronizar_categoria_enlace(self, producto_id: int, categoria_id: Optional[int]) -> None:
        actuales = list(
            self.session.exec(
                select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
            ).all()
        )
        for link in actuales:
            self.session.delete(link)
        self.session.flush()

        if categoria_id is not None:
            nuevo_link = ProductoCategoria(
                producto_id=producto_id,
                categoria_id=categoria_id,
                es_principal=True,
            )
            self.session.add(nuevo_link)
            self.session.flush()
