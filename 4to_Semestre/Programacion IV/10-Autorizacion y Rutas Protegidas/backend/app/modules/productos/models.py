from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, max_length=150)
    descripcion: str = Field(default="")
    precio_base: float = Field(default=0.0, ge=0)
    disponible: bool = Field(default=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None)

class ProductoCategoria(SQLModel, table=True):
    producto_id: int = Field(primary_key=True, foreign_key="producto.id")
    categoria_id: int = Field(primary_key=True, foreign_key="categoria.id")
    es_principal: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
