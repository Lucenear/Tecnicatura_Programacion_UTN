from typing import List
from fastapi import APIRouter, HTTPException, status
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteRead
from app.modules.ingredientes.service import (
    IngredienteService,
    IngredienteNoEncontrado,
    IngredienteDuplicado,
)

router = APIRouter(prefix="/ingredientes", tags=["ingredientes"])
service = IngredienteService()

@router.get("", response_model=List[IngredienteRead])
def get_ingredientes():
    return service.get_all()

@router.get("/{id}", response_model=IngredienteRead)
def get_ingrediente(id: int):
    try:
        return service.get_by_id(id)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente(data: IngredienteCreate):
    try:
        return service.crear(data)
    except IngredienteDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.put("/{id}", response_model=IngredienteRead)
def actualizar_ingrediente(id: int, data: IngredienteUpdate):
    try:
        return service.actualizar(id, data)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except IngredienteDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(id: int):
    try:
        service.eliminar(id)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
