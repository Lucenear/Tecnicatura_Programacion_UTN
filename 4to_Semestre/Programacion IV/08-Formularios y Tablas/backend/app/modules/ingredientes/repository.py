from typing import Optional
from sqlmodel import Session, select, func
from app.core.repository import BaseRepository
from app.modules.ingredientes.models import Ingrediente

class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(session, Ingrediente)

    def get_by_nombre(self, nombre: str) -> Optional[Ingrediente]:
        statement = select(Ingrediente).where(func.lower(Ingrediente.nombre) == func.lower(nombre))
        return self.session.exec(statement).first()
