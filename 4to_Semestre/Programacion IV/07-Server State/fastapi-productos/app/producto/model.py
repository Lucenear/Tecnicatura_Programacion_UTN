from typing import Optional, List
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import ARRAY

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: float = Field(ge=0)
    imagenes_url: List[str] = Field(default_factory=list, sa_column=Column(ARRAY(String)))
    disponible: bool = Field(default=True)

class ProductoCategoria(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id", primary_key=True)
    es_principal: bool = Field(default=False)
