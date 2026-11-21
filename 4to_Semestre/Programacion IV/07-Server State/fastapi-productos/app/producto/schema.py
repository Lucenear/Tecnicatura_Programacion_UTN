from typing import Optional, List
from pydantic import BaseModel, Field

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: List[str] = []
    disponible: bool = True

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = Field(default=None, ge=0)
    imagenes_url: Optional[List[str]] = None
    disponible: Optional[bool] = None

class ProductoResponse(ProductoBase):
    id: int

    class Config:
        from_attributes = True

class ProductoCategoriaCreate(BaseModel):
    categoria_id: int
    es_principal: bool = False

class ProductoCategoriaResponse(BaseModel):
    producto_id: int
    categoria_id: int
    es_principal: bool = False

    class Config:
        from_attributes = True
