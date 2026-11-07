from typing import List
from fastapi import HTTPException, status
from sqlmodel import Session
from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate
from repositories.producto_repository import ProductoRepository

class ProductoService:
    def __init__(self, repository: ProductoRepository):
        self.repository = repository

    def listar_productos(self, session: Session) -> List[Producto]:
        return self.repository.get_all(session)

    def obtener_producto_por_id(self, session: Session, producto_id: int) -> Producto:
        producto = self.repository.get_by_id(session, producto_id)
        if not producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        return producto

    def crear_producto(self, session: Session, producto_in: ProductoCreate) -> Producto:
        existente = self.repository.get_by_nombre(session, producto_in.nombre)
        if existente:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un producto con ese nombre"
            )
        return self.repository.create(session, producto_in)

    def actualizar_producto(self, session: Session, producto_id: int, producto_in: ProductoUpdate) -> Producto:
        db_producto = self.repository.get_by_id(session, producto_id)
        if not db_producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )

        if producto_in.nombre is not None:
            existente = self.repository.get_by_nombre(session, producto_in.nombre)
            if existente and existente.id != producto_id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe un producto con ese nombre"
                )

        return self.repository.update(session, db_producto, producto_in)

    def eliminar_producto(self, session: Session, producto_id: int) -> dict:
        db_producto = self.repository.get_by_id(session, producto_id)
        if not db_producto:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Producto no encontrado"
            )
        self.repository.delete(session, db_producto)
        return {"mensaje": "Producto eliminado exitosamente"}
