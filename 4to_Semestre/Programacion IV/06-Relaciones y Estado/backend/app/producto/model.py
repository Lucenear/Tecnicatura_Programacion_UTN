from typing import Optional, List
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship
from app.categoria.model import Categoria

class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: Optional[int] = Field(
        default=None,
        foreign_key="producto.id",
        primary_key=True
    )
    categoria_id: Optional[int] = Field(
        default=None,
        foreign_key="categoria.id",
        primary_key=True
    )

class Producto(SQLModel, table=True):
    __tablename__ = "producto"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    descripcion: str
    precio_base: str
    imagen_url: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    disponible: bool = True

    categorias: List[Categoria] = Relationship(link_model=ProductoCategoria)
