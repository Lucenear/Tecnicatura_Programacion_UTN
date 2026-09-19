from fastapi import APIRouter, HTTPException, Path, Query, status
from typing import List, Optional
from . import schemas, services

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])


@router.post(
    "/", response_model=schemas.ProveedorRead, status_code=status.HTTP_201_CREATED
)
def crear_proveedor(proveedor: schemas.ProveedorCreate):
    if services.codigo_existe(proveedor.codigo):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El codigo del proveedor ya existe",
        )
    return services.crear(proveedor)


@router.get(
    "/", response_model=List[schemas.ProveedorRead], status_code=status.HTTP_200_OK
)
def listar_proveedores(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=50),
    activo: Optional[bool] = Query(None),
):
    return services.obtener_todos(skip, limit, activo)


@router.get(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def detalle_proveedor(id: int = Path(..., gt=0)):
    proveedor = services.obtener_por_id(id)
    if not proveedor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )
    return proveedor


@router.put(
    "/{id}", response_model=schemas.ProveedorRead, status_code=status.HTTP_200_OK
)
def actualizar_proveedor(proveedor: schemas.ProveedorUpdate, id: int = Path(..., gt=0)):
    existente = services.obtener_por_id(id)
    if not existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )

    if proveedor.codigo is not None and services.codigo_existe(
        proveedor.codigo, exclude_id=id
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El codigo del proveedor ya existe",
        )

    actualizado = services.actualizar(id, proveedor)
    return actualizado


@router.put(
    "/{id}/desactivar",
    response_model=schemas.ProveedorRead,
    status_code=status.HTTP_200_OK,
)
def desactivar_proveedor(id: int = Path(..., gt=0)):
    existente = services.obtener_por_id(id)
    if not existente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Proveedor no encontrado"
        )

    if not existente.activo:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El proveedor ya esta desactivado",
        )

    desactivado = services.desactivar(id)
    return desactivado
