from datetime import datetime
from typing import TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from app.modules.unidades_medida.model import UnidadMedida

if TYPE_CHECKING:
    from app.modules.categorias.model import Categoria

class ProductoCategoria(SQLModel, table=True):
    __tablename__ = "producto_categoria"

    producto_id: int = Field(foreign_key="productos.id", primary_key=True)
    categoria_id: int = Field(foreign_key="categorias.id", primary_key=True)
    es_principal: bool = Field(default=False)

class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: int | None = Field(default=None, primary_key=True)
    unidad_venta_id: int = Field(foreign_key="unidades_medida.id")
    nombre: str = Field(index=True)
    descripcion: str | None = Field(default=None)
    precio_base: float = Field(default=0.0)
    stock_cantidad: float = Field(default=0.0)
    disponible: bool = Field(default=True)
    activo: bool = Field(default=True)
    anulado_at: datetime | None = Field(default=None)

    unidad_venta: UnidadMedida | None = Relationship(back_populates="productos")
    categorias: list["Categoria"] = Relationship(
        back_populates="productos",
        link_model=ProductoCategoria
    )
