from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class FormaPago(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=30)
    descripcion: str = Field(max_length=80)
    activo: bool = Field(default=True)

class EstadoPedido(SQLModel, table=True):
    codigo: str = Field(primary_key=True, max_length=20)
    descripcion: str = Field(max_length=80)
    orden: int
    es_terminal: bool

class Pedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuario.id")
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    estado: str = Field(default="PENDIENTE")
    total: float = Field(default=0.0)
    deleted_at: Optional[datetime] = Field(default=None)

class DetallePedido(SQLModel, table=True):
    pedido_id: int = Field(primary_key=True, foreign_key="pedido.id")
    producto_id: int = Field(primary_key=True, foreign_key="producto.id")
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)
