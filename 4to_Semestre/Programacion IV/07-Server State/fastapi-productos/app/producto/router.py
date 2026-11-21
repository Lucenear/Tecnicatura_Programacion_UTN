from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.database import get_session
from app.categoria.schema import CategoriaResponse
from app.categoria import service as categoria_service
from app.producto.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoResponse,
    ProductoCategoriaCreate,
    ProductoCategoriaResponse,
)
from app.producto import service

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("/", response_model=List[ProductoResponse])
def listar_productos(session: Session = Depends(get_session)):
    return service.get_productos(session)

@router.get("/{id}", response_model=ProductoResponse)
def obtener_producto(id: int, session: Session = Depends(get_session)):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return producto

@router.post("/", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def crear_producto(data: ProductoCreate, session: Session = Depends(get_session)):
    return service.create_producto(session, data)

@router.put("/{id}", response_model=ProductoResponse)
def actualizar_producto(id: int, data: ProductoUpdate, session: Session = Depends(get_session)):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return service.update_producto(session, producto, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_producto(id: int, session: Session = Depends(get_session)):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    service.delete_producto(session, producto)
    return None

@router.post("/{id}/categorias", response_model=ProductoCategoriaResponse, status_code=status.HTTP_201_CREATED)
def asignar_categoria(
    id: int,
    data: ProductoCategoriaCreate,
    session: Session = Depends(get_session)
):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    categoria = categoria_service.get_categoria_by_id(session, data.categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    relacion = service.asignar_categoria_a_producto(session, id, data.categoria_id, data.es_principal)
    return relacion

@router.get("/{id}/categorias", response_model=List[CategoriaResponse])
def listar_categorias_de_producto(id: int, session: Session = Depends(get_session)):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    return service.get_categorias_de_producto(session, id)

@router.delete("/{id}/categorias/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria_de_producto(
    id: int,
    categoria_id: int,
    session: Session = Depends(get_session)
):
    producto = service.get_producto_by_id(session, id)
    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado"
        )
    eliminado = service.eliminar_categoria_de_producto(session, id, categoria_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asociacion no encontrada"
        )
    return None
