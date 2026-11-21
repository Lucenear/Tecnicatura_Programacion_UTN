from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from app.core.database import get_session
from app.categoria.schema import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.categoria import service

router = APIRouter(prefix="/categorias", tags=["categorias"])

@router.get("", response_model=List[CategoriaResponse])
def get_categorias(session: Session = Depends(get_session)):
    return service.get_all_categorias(session)

@router.get("/{categoria_id}", response_model=CategoriaResponse)
def get_categoria(categoria_id: int, session: Session = Depends(get_session)):
    categoria = service.get_categoria_by_id(session, categoria_id)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    return categoria

@router.post("", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_categoria(data: CategoriaCreate, session: Session = Depends(get_session)):
    return service.create_categoria(session, data)

@router.put("/{categoria_id}", response_model=CategoriaResponse)
def update_categoria(categoria_id: int, data: CategoriaUpdate, session: Session = Depends(get_session)):
    categoria = service.update_categoria(session, categoria_id, data)
    if not categoria:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    return categoria

@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria(categoria_id: int, session: Session = Depends(get_session)):
    eliminado = service.delete_categoria(session, categoria_id)
    if not eliminado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Categoria no encontrada"
        )
    return None
