from typing import Optional
from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints, Field

class ProductoBase(BaseModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    descripcion: str = ""
    precio_base: float = Field(ge=0)
    disponible: bool = True
    categoria_id: Optional[int] = None

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0)
    disponible: Optional[bool] = None
    categoria_id: Optional[int] = None

class ProductoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str
    precio_base: float
    disponible: bool
    categoria_id: Optional[int] = None
