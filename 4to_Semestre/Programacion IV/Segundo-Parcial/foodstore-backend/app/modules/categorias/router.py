from typing import Annotated
from fastapi import APIRouter, Depends, Query, Path, status, Response
from sqlmodel import Session
from app.core.database import get_session
from app.modules.categorias.schema import CategoriaCreate, CategoriaUpdate, CategoriaPublic
from app.modules.categorias import service

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.post("", response_model=CategoriaPublic, status_code=status.HTTP_201_CREATED)
def crear(
    data: CategoriaCreate,
    session: Session = Depends(get_session),
):
    return service.crear_categoria(session=session, data=data)

@router.get("", response_model=list[CategoriaPublic])
def listar(
    activo: bool | None = Query(default=None),
    search: str | None = Query(default=None),
    session: Session = Depends(get_session),
):
    return service.obtener_categorias(session=session, activo=activo, search=search)

@router.get("/{id}", response_model=CategoriaPublic)
def obtener(
    id: Annotated[int, Path()],
    session: Session = Depends(get_session),
):
    return service.obtener_categoria_por_id(session=session, id=id)

@router.put("/{id}", response_model=CategoriaPublic)
def actualizar(
    id: Annotated[int, Path()],
    data: CategoriaUpdate,
    session: Session = Depends(get_session),
):
    return service.actualizar_categoria(session=session, id=id, data=data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def anular(
    id: Annotated[int, Path()],
    session: Session = Depends(get_session),
):
    service.anular_categoria(session=session, id=id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
