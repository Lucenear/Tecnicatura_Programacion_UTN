from typing import Optional, Annotated
from pydantic import StringConstraints
from sqlmodel import SQLModel, Field

class ProductoBase(SQLModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    descripcion: Optional[str] = None
    precio: float = Field(ge=0)

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(SQLModel):
    nombre: Optional[Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = Field(default=None, ge=0)

class ProductoRead(ProductoBase):
    id: int
