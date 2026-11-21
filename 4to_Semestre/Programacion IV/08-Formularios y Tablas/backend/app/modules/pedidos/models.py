from typing import Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class Pedido(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    estado: str = Field(default="PENDIENTE")
    total: float = Field(default=0.0)
    deleted_at: Optional[datetime] = Field(default=None)

class DetallePedido(SQLModel, table=True):
    pedido_id: int = Field(primary_key=True, foreign_key="pedido.id")
    producto_id: int = Field(primary_key=True, foreign_key="producto.id")
    cantidad: int = Field(ge=1)
    precio_unitario: float = Field(ge=0)
