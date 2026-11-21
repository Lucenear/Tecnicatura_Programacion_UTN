from typing import List, Optional
from sqlmodel import Session, select, func
from app.core.repository import BaseRepository
from app.modules.ingredientes.models import Ingrediente

class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(session, Ingrediente)

    def get_all(self, include_deleted: bool = False) -> List[Ingrediente]:
        statement = select(Ingrediente)
        if not include_deleted:
            statement = statement.where(Ingrediente.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

    def get_by_id(self, id: int, include_deleted: bool = False) -> Optional[Ingrediente]:
        item = self.session.get(Ingrediente, id)
        if item and not include_deleted and item.deleted_at is not None:
            return None
        return item

    def get_by_nombre(self, nombre: str, include_deleted: bool = False) -> Optional[Ingrediente]:
        statement = select(Ingrediente).where(func.lower(Ingrediente.nombre) == func.lower(nombre))
        if not include_deleted:
            statement = statement.where(Ingrediente.deleted_at.is_(None))
        return self.session.exec(statement).first()
