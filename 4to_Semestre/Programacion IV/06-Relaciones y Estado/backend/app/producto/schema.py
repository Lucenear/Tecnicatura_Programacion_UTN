from typing import Optional, List
from sqlmodel import SQLModel
from app.categoria.schema import CategoriaResponse

class ProductoBase(SQLModel):
    nombre: str
    descripcion: str
    precio_base: str
    imagen_url: List[str] = []
    disponible: bool = True

class ProductoCreate(ProductoBase):
    categoria_ids: Optional[List[int]] = None

class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[str] = None
    imagen_url: Optional[List[str]] = None
    disponible: Optional[bool] = None

class ProductoResponse(ProductoBase):
    id: int
    categorias: List[CategoriaResponse] = []

class ProductoCategoriaCreate(SQLModel):
    producto_id: int
    categoria_id: int

class ProductoCategoriaResponse(SQLModel):
    producto_id: int
    categoria_id: int
