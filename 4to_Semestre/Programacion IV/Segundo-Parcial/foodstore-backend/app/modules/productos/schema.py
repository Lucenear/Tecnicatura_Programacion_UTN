from datetime import datetime
from typing import Annotated
from sqlmodel import SQLModel, Field
from app.modules.unidades_medida.router import UnidadMedidaPublic
from app.modules.categorias.schema import CategoriaPublic

class ProductoBase(SQLModel):
    nombre: Annotated[str, Field(min_length=3)]
    descripcion: str | None = None
    precio_base: Annotated[float, Field(ge=0)]
    unidad_venta_id: Annotated[int, Field(gt=0)]
    stock_cantidad: Annotated[float, Field(ge=0)] = 0.0
    disponible: bool = True

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    pass

class ProductoPublic(SQLModel):
    id: int
    nombre: str
    descripcion: str | None = None
    precio_base: float
    stock_cantidad: float
    disponible: bool
    activo: bool
    anulado_at: datetime | None = None
    unidad_venta_id: int
    unidad_venta: UnidadMedidaPublic
    categorias: list[CategoriaPublic] = []
    hay_stock: bool

class ClasificarCategoriaRequest(SQLModel):
    categoria_id: Annotated[int, Field(gt=0)]
    es_principal: bool = False

class ProductoCategoriaPublic(SQLModel):
    producto_id: int
    categoria_id: int
    es_principal: bool

class CategoriaProductoPublic(SQLModel):
    id: int
    nombre: str
    descripcion: str | None = None
    activo: bool
    es_principal: bool
