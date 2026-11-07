from typing import Optional, List
from sqlmodel import Session, select, func
from models.producto import Producto
from schemas.producto import ProductoCreate, ProductoUpdate

class ProductoRepository:
    def get_all(self, session: Session) -> List[Producto]:
        statement = select(Producto)
        return list(session.exec(statement).all())

    def get_by_id(self, session: Session, producto_id: int) -> Optional[Producto]:
        return session.get(Producto, producto_id)

    def get_by_nombre(self, session: Session, nombre: str) -> Optional[Producto]:
        statement = select(Producto).where(func.lower(Producto.nombre) == nombre.strip().lower())
        return session.exec(statement).first()

    def create(self, session: Session, producto_in: ProductoCreate) -> Producto:
        db_producto = Producto.model_validate(producto_in)
        session.add(db_producto)
        session.commit()
        session.refresh(db_producto)
        return db_producto

    def update(self, session: Session, db_producto: Producto, producto_in: ProductoUpdate) -> Producto:
        update_data = producto_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_producto, key, value)
        session.add(db_producto)
        session.commit()
        session.refresh(db_producto)
        return db_producto

    def delete(self, session: Session, db_producto: Producto) -> None:
        session.delete(db_producto)
        session.commit()
