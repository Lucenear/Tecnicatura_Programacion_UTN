from typing import List
from fastapi import APIRouter, HTTPException, status
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead
from app.modules.categorias.service import (
    CategoriaService,
    CategoriaNoEncontrada,
    CategoriaDuplicada,
    CategoriaConProductos,
)

router = APIRouter(prefix="/categorias", tags=["categorias"])
service = CategoriaService()

@router.get("", response_model=List[CategoriaRead])
def get_categorias():
    return service.get_all()

@router.get("/{id}", response_model=CategoriaRead)
def get_categoria(id: int):
    try:
        return service.get_by_id(id)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate):
    try:
        return service.crear(data)
    except CategoriaDuplicada as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.put("/{id}", response_model=CategoriaRead)
def actualizar_categoria(id: int, data: CategoriaUpdate):
    try:
        return service.actualizar(id, data)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CategoriaDuplicada as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(id: int):
    try:
        service.eliminar(id)
    except CategoriaNoEncontrada as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except CategoriaConProductos as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
