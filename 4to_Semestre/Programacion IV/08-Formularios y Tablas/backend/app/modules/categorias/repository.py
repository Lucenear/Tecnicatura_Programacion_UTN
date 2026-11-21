from typing import Optional
from sqlmodel import Session, select, func
from app.core.repository import BaseRepository
from app.modules.categorias.models import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Optional[Categoria]:
        statement = select(Categoria).where(func.lower(Categoria.nombre) == func.lower(nombre))
        return self.session.exec(statement).first()
