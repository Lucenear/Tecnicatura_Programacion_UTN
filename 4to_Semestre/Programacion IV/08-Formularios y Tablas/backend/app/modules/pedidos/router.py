from typing import List
from fastapi import APIRouter, HTTPException, status
from app.modules.pedidos.schemas import (
    PedidoCreate,
    PedidoEstadoUpdate,
    PedidoRead,
)
from app.modules.pedidos.service import (
    PedidoService,
    PedidoNoEncontrado,
    ProductoNoEncontrado,
    EstadoTerminalError,
)

router = APIRouter(prefix="/pedidos", tags=["pedidos"])
service = PedidoService()

@router.get("", response_model=List[PedidoRead])
def get_pedidos():
    return service.get_all()

@router.get("/{id}", response_model=PedidoRead)
def get_pedido(id: int):
    try:
        return service.get_by_id(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(data: PedidoCreate):
    try:
        return service.crear(data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{id}", response_model=PedidoRead)
def actualizar_estado_pedido(id: int, data: PedidoEstadoUpdate):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except EstadoTerminalError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(id: int):
    try:
        service.eliminar(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
