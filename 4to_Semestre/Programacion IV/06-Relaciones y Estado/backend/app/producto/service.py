from typing import List, Optional
from sqlmodel import Session, select
from app.producto.model import Producto, ProductoCategoria
from app.categoria.model import Categoria
from app.producto.schema import ProductoCreate, ProductoUpdate

def get_all_productos(session: Session) -> List[Producto]:
    statement = select(Producto)
    return list(session.exec(statement).all())

def get_producto_by_id(session: Session, producto_id: int) -> Optional[Producto]:
    return session.get(Producto, producto_id)

def create_producto(session: Session, data: ProductoCreate) -> Producto:
    producto_data = data.model_dump(exclude={"categoria_ids"})
    producto = Producto(**producto_data)
    if data.categoria_ids:
        for cat_id in data.categoria_ids:
            categoria = session.get(Categoria, cat_id)
            if categoria:
                producto.categorias.append(categoria)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def update_producto(session: Session, producto_id: int, data: ProductoUpdate) -> Optional[Producto]:
    producto = session.get(Producto, producto_id)
    if not producto:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(producto, key, value)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def delete_producto(session: Session, producto_id: int) -> bool:
    producto = session.get(Producto, producto_id)
    if not producto:
        return False
    producto.categorias.clear()
    session.delete(producto)
    session.commit()
    return True

def get_all_producto_categorias(session: Session) -> List[ProductoCategoria]:
    statement = select(ProductoCategoria)
    return list(session.exec(statement).all())

def add_categoria_to_producto(session: Session, producto_id: int, categoria_id: int) -> Optional[ProductoCategoria]:
    producto = session.get(Producto, producto_id)
    categoria = session.get(Categoria, categoria_id)
    if not producto or not categoria:
        return None
    existente = session.exec(
        select(ProductoCategoria).where(
            ProductoCategoria.producto_id == producto_id,
            ProductoCategoria.categoria_id == categoria_id
        )
    ).first()
    if existente:
        return existente
    relacion = ProductoCategoria(producto_id=producto_id, categoria_id=categoria_id)
    session.add(relacion)
    session.commit()
    session.refresh(relacion)
    return relacion

def remove_categoria_from_producto(session: Session, producto_id: int, categoria_id: int) -> bool:
    relacion = session.exec(
        select(ProductoCategoria).where(
            ProductoCategoria.producto_id == producto_id,
            ProductoCategoria.categoria_id == categoria_id
        )
    ).first()
    if not relacion:
        return False
    session.delete(relacion)
    session.commit()
    return True
