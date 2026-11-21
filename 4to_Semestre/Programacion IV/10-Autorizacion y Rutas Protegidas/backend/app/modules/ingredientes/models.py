from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(index=True, unique=True, max_length=100)
    costo: float = Field(default=0.0)
    stock: int = Field(default=0)
    unidad: str = Field(default="u", max_length=20)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = Field(default=None)
