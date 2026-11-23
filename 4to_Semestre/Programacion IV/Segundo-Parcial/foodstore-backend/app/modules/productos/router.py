from typing import Annotated
from fastapi import APIRouter, Depends, Query, Path, status, Response
from sqlmodel import Session
from app.core.database import get_session
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoPublic,
    ClasificarCategoriaRequest,
    ProductoCategoriaPublic,
    CategoriaProductoPublic,
)
from app.modules.productos import service

router = APIRouter(prefix="/productos", tags=["productos"])

@router.post("", response_model=ProductoPublic, status_code=status.HTTP_201_CREATED)
def crear(
    data: ProductoCreate,
    session: Session = Depends(get_session),
):
    return service.crear_producto(session=session, data=data)

@router.get("", response_model=list[ProductoPublic])
def listar(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=50),
    activo: bool | None = Query(default=None),
    disponible: bool | None = Query(default=None),
    categoria_id: int | None = Query(default=None),
    search: str | None = Query(default=None),
    session: Session = Depends(get_session),
):
    return service.obtener_productos(
        session=session,
        skip=skip,
        limit=limit,
        activo=activo,
        disponible=disponible,
        categoria_id=categoria_id,
        search=search,
    )

@router.get("/{id}", response_model=ProductoPublic)
def obtener(
    id: Annotated[int, Path()],
    session: Session = Depends(get_session),
):
    return service.obtener_producto_por_id(session=session, id=id)

@router.put("/{id}", response_model=ProductoPublic)
def actualizar(
    id: Annotated[int, Path()],
    data: ProductoUpdate,
    session: Session = Depends(get_session),
):
    return service.actualizar_producto(session=session, id=id, data=data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def anular(
    id: Annotated[int, Path()],
    session: Session = Depends(get_session),
):
    service.anular_producto(session=session, id=id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post(
    "/{id}/categorias",
    response_model=ProductoCategoriaPublic,
    status_code=status.HTTP_201_CREATED,
)
def clasificar(
    id: Annotated[int, Path()],
    data: ClasificarCategoriaRequest,
    session: Session = Depends(get_session),
):
    return service.clasificar_producto_en_categoria(
        session=session, producto_id=id, data=data
    )

@router.get("/{id}/categorias", response_model=list[CategoriaProductoPublic])
def listar_categorias_de_producto(
    id: Annotated[int, Path()],
    session: Session = Depends(get_session),
):
    return service.obtener_categorias_de_producto(session=session, producto_id=id)
