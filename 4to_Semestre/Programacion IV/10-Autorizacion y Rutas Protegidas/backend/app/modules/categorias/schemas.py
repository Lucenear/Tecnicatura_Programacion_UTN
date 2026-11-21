from typing import Optional
from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

class CategoriaBase(BaseModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
    descripcion: str = ""

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]] = None
    descripcion: Optional[str] = None

class CategoriaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    descripcion: str
