from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator

class DetallePedidoCreate(BaseModel):
    producto_id: int
    cantidad: int = Field(ge=1)

class PedidoCreate(BaseModel):
    detalles: List[DetallePedidoCreate]

    @field_validator("detalles")
    @classmethod
    def validar_detalles(cls, v):
        if not v or len(v) == 0:
            raise ValueError("El pedido debe tener al menos un detalle")
        productos = [item.producto_id for item in v]
        if len(productos) != len(set(productos)):
            raise ValueError("No se puede repetir un mismo producto en los detalles del pedido")
        return v

class PedidoEstadoUpdate(BaseModel):
    estado: str

    @field_validator("estado")
    @classmethod
    def validar_estado(cls, v):
        permitidos = ("PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO")
        if v not in permitidos:
            raise ValueError(f"Estado invalido. Debe ser uno de: {', '.join(permitidos)}")
        return v

class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    pedido_id: int
    producto_id: int
    cantidad: int
    precio_unitario: float
    subtotal: Optional[float] = None

class PedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    fecha: datetime
    estado: str
    total: float
    deleted_at: Optional[datetime] = None
    detalles: List[DetallePedidoRead] = []
