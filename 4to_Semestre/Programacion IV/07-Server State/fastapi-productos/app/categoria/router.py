from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.database import get_session
from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(session: Session = Depends(get_session)):
    return service.get_categorias(session)

@router.get("/{id}", response_model=CategoriaResponse)
def obtener_categoria(id: int, session: Session = Depends(get_session)):
    categoria = service.get_categoria_by_id(session, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    return categoria

@router.post("/", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, session: Session = Depends(get_session)):
    return service.create_categoria(session, data)

@router.put("/{id}", response_model=CategoriaResponse)
def actualizar_categoria(id: int, data: CategoriaUpdate, session: Session = Depends(get_session)):
    categoria = service.get_categoria_by_id(session, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    return service.update_categoria(session, categoria, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int, session: Session = Depends(get_session)):
    categoria = service.get_categoria_by_id(session, id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    service.delete_categoria(session, categoria)
    return None
