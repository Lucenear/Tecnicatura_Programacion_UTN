from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.database import get_session
from app.producto.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoCategoriaCreate,
    ProductoCategoriaResponse
)
from app.producto import service

router = APIRouter(prefix="/productos", tags=["productos"])
relacion_router = APIRouter(prefix="/producto-categoria", tags=["producto-categoria"])

@router.get("", response_model=List[ProductoResponse])
def get_productos(session: Session = Depends(get_session)):
    return service.get_all_productos(session)

@router.get("/{producto_id}", response_model=ProductoResponse)
def get_producto(producto_id: int, session: Session = Depends(get_session)):
    producto = service.get_producto_by_id(session, producto_id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def create_producto(data: ProductoCreate, session: Session = Depends(get_session)):
    return service.create_producto(session, data)

@router.put("/{producto_id}", response_model=ProductoResponse)
def update_producto(producto_id: int, data: ProductoUpdate, session: Session = Depends(get_session)):
    producto = service.update_producto(session, producto_id, data)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

@router.delete("/{producto_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_producto(producto_id: int, session: Session = Depends(get_session)):
    eliminado = service.delete_producto(session, producto_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return None

@router.post("/{producto_id}/categorias/{categoria_id}", response_model=ProductoCategoriaResponse, status_code=status.HTTP_201_CREATED)
def add_categoria_a_producto(producto_id: int, categoria_id: int, session: Session = Depends(get_session)):
    relacion = service.add_categoria_to_producto(session, producto_id, categoria_id)
    if not relacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto o categoria no encontrada"
        )
    return relacion

@router.delete("/{producto_id}/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_categoria_de_producto(producto_id: int, categoria_id: int, session: Session = Depends(get_session)):
    eliminado = service.remove_categoria_from_producto(session, producto_id, categoria_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relacion no encontrada"
        )
    return None

@relacion_router.get("", response_model=List[ProductoCategoriaResponse])
def get_relaciones(session: Session = Depends(get_session)):
    return service.get_all_producto_categorias(session)

@relacion_router.post("", response_model=ProductoCategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_relacion(data: ProductoCategoriaCreate, session: Session = Depends(get_session)):
    relacion = service.add_categoria_to_producto(session, data.producto_id, data.categoria_id)
    if not relacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto o categoria no encontrada"
        )
    return relacion

@relacion_router.delete("/{producto_id}/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_relacion(producto_id: int, categoria_id: int, session: Session = Depends(get_session)):
    eliminado = service.remove_categoria_from_producto(session, producto_id, categoria_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Relacion no encontrada"
        )
    return None
