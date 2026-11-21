from typing import Optional
from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

class IngredienteBase(BaseModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class IngredienteCreate(IngredienteBase):
    pass

class IngredienteUpdate(BaseModel):
    nombre: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]

class IngredienteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
