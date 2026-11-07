from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from database import get_session
from schemas.producto import ProductoCreate, ProductoUpdate, ProductoRead
from repositories.producto_repository import ProductoRepository
from services.producto_service import ProductoService

router = APIRouter(prefix="/productos", tags=["Productos"])

repository = ProductoRepository()
service = ProductoService(repository)

@router.get("", response_model=List[ProductoRead], status_code=status.HTTP_200_OK)
@router.get("/", response_model=List[ProductoRead], status_code=status.HTTP_200_OK, include_in_schema=False)
def listar_productos(session: Session = Depends(get_session)):
    return service.listar_productos(session)

@router.get("/{producto_id}", response_model=ProductoRead, status_code=status.HTTP_200_OK)
def obtener_producto(producto_id: int, session: Session = Depends(get_session)):
    return service.obtener_producto_por_id(session, producto_id)

@router.post("", response_model=ProductoRead, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def crear_producto(producto_in: ProductoCreate, session: Session = Depends(get_session)):
    return service.crear_producto(session, producto_in)

@router.put("/{producto_id}", response_model=ProductoRead, status_code=status.HTTP_200_OK)
def actualizar_producto(producto_id: int, producto_in: ProductoUpdate, session: Session = Depends(get_session)):
    return service.actualizar_producto(session, producto_id, producto_in)

@router.delete("/{producto_id}", status_code=status.HTTP_200_OK)
def eliminar_producto(producto_id: int, session: Session = Depends(get_session)):
    return service.eliminar_producto(session, producto_id)
