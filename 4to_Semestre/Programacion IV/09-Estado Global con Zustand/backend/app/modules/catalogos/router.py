from typing import List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.dependencies import get_current_active_user
from app.modules.usuarios.models import Rol, Usuario
from app.modules.pedidos.models import FormaPago, EstadoPedido

router = APIRouter(prefix="/catalogos", tags=["catalogos"])

@router.get("/roles")
def get_roles(_: Usuario = Depends(get_current_active_user), session: Session = Depends(get_session)):
    return list(session.exec(select(Rol)).all())

@router.get("/formas-pago")
def get_formas_pago(_: Usuario = Depends(get_current_active_user), session: Session = Depends(get_session)):
    return list(session.exec(select(FormaPago)).all())

@router.get("/estados-pedido")
def get_estados_pedido(_: Usuario = Depends(get_current_active_user), session: Session = Depends(get_session)):
    return list(session.exec(select(EstadoPedido).order_by(EstadoPedido.orden)).all())
