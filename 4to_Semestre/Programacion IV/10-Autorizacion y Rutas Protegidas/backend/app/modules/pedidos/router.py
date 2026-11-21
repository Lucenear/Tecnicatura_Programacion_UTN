from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
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

router = APIRouter(tags=["pedidos"])
service = PedidoService()

@router.get("", response_model=List[PedidoRead])
def get_pedidos(_: Usuario = Depends(get_current_active_user)):
    return service.get_all()

@router.get("/{id}", response_model=PedidoRead)
def get_pedido(id: int, _: Usuario = Depends(get_current_active_user)):
    try:
        return service.get_by_id(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=PedidoRead, status_code=status.HTTP_201_CREATED)
def crear_pedido(data: PedidoCreate, current_user: Usuario = Depends(get_current_active_user)):
    try:
        return service.crear(data, usuario_id=current_user.id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{id}", response_model=PedidoRead)
def actualizar_estado_pedido(id: int, data: PedidoEstadoUpdate, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.actualizar_estado(id, data)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except EstadoTerminalError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_pedido(id: int, _: Usuario = Depends(require_role(["admin"]))):
    try:
        service.eliminar(id)
    except PedidoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
