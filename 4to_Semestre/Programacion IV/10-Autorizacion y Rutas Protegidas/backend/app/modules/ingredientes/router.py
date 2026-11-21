from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.dependencies import get_current_active_user, require_role
from app.modules.usuarios.models import Usuario
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteRead
from app.modules.ingredientes.service import (
    IngredienteService,
    IngredienteNoEncontrado,
    IngredienteDuplicado,
)

router = APIRouter(tags=["ingredientes"])
service = IngredienteService()

@router.get("", response_model=List[IngredienteRead])
def get_ingredientes(_: Usuario = Depends(get_current_active_user)):
    return service.get_all()

@router.get("/{id}", response_model=IngredienteRead)
def get_ingrediente(id: int, _: Usuario = Depends(get_current_active_user)):
    try:
        return service.get_by_id(id)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def crear_ingrediente(data: IngredienteCreate, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.crear(data)
    except IngredienteDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.put("/{id}", response_model=IngredienteRead)
def actualizar_ingrediente(id: int, data: IngredienteUpdate, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.actualizar(id, data)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except IngredienteDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_ingrediente(id: int, _: Usuario = Depends(require_role(["admin"]))):
    try:
        service.eliminar(id)
    except IngredienteNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
