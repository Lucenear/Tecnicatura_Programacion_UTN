from typing import Optional
from sqlmodel import SQLModel, Field

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True)
    descripcion: str = Field(default="")
    precio_base: float = Field(default=0.0)
    disponible: bool = Field(default=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
