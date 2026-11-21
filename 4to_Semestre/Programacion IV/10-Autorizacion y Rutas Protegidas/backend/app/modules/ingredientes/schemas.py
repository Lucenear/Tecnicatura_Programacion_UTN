from typing import Optional
from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

class IngredienteBase(BaseModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    costo: float = 0.0
    stock: int = 0
    unidad: str = "u"

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]] = None
    costo: Optional[float] = None
    stock: Optional[int] = None
    unidad: Optional[str] = None

class IngredienteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    costo: float
    stock: int
    unidad: str
