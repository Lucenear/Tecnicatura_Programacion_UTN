from typing import Optional
from sqlmodel import SQLModel, Field

class Categoria(SQLModel, table=True):
    __tablename__ = "categoria"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
