from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.core.database import get_session
from app.modules.unidades_medida.model import UnidadMedida, TipoUnidad
from sqlmodel import SQLModel

class UnidadMedidaPublic(SQLModel):
    id: int
    nombre: str
    simbolo: str
    tipo: TipoUnidad

router = APIRouter(prefix="/unidades-medida", tags=["unidades-medida"])

@router.get("", response_model=list[UnidadMedidaPublic])
def listar_unidades(session: Session = Depends(get_session)):
    unidades = session.exec(select(UnidadMedida)).all()
    return unidades
