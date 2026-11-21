from typing import List, Optional
from sqlmodel import Session, select, func
from app.core.repository import BaseRepository
from app.modules.categorias.models import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_all(self, include_deleted: bool = False) -> List[Categoria]:
        statement = select(Categoria)
        if not include_deleted:
            statement = statement.where(Categoria.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

    def get_by_id(self, id: int, include_deleted: bool = False) -> Optional[Categoria]:
        categoria = self.session.get(Categoria, id)
        if categoria and not include_deleted and categoria.deleted_at is not None:
            return None
        return categoria

    def get_by_nombre(self, nombre: str, include_deleted: bool = False) -> Optional[Categoria]:
        statement = select(Categoria).where(func.lower(Categoria.nombre) == func.lower(nombre))
        if not include_deleted:
            statement = statement.where(Categoria.deleted_at.is_(None))
        return self.session.exec(statement).first()
