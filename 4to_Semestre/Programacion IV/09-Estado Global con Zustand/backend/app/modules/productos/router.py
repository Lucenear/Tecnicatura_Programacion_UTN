from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate, ProductoRead
from app.modules.productos.service import (
    ProductoService,
    ProductoNoEncontrado,
    CategoriaInexistente,
)

router = APIRouter(tags=["productos"])
service = ProductoService()

@router.get("", response_model=List[ProductoRead])
def get_productos(_: Usuario = Depends(get_current_active_user)):
    return service.get_all()

@router.get("/{id}", response_model=ProductoRead)
def get_producto(id: int, _: Usuario = Depends(get_current_active_user)):
    try:
        return service.get_by_id(id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.crear(data)
    except CategoriaInexistente as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.put("/{id}", response_model=ProductoRead)
def actualizar_producto(id: int, data: ProductoUpdate, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.actualizar(id, data)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CategoriaInexistente as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int, _: Usuario = Depends(require_role(["admin"]))):
    try:
        service.eliminar(id)
    except ProductoNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
