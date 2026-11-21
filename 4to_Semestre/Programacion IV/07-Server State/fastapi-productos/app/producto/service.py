from typing import List, Optional
from sqlmodel import Session, select
from app.producto.model import Producto, ProductoCategoria
from app.categoria.model import Categoria
from app.producto.schema import ProductoCreate, ProductoUpdate

def get_productos(session: Session) -> List[Producto]:
    statement = select(Producto)
    return list(session.exec(statement).all())

def get_producto_by_id(session: Session, producto_id: int) -> Optional[Producto]:
    return session.get(Producto, producto_id)

def create_producto(session: Session, producto_data: ProductoCreate) -> Producto:
    producto = Producto.model_validate(producto_data)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def update_producto(session: Session, producto: Producto, producto_data: ProductoUpdate) -> Producto:
    datos = producto_data.model_dump(exclude_unset=True)
    for clave, valor in datos.items():
        setattr(producto, clave, valor)
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto

def delete_producto(session: Session, producto: Producto) -> None:
    relaciones = session.exec(
        select(ProductoCategoria).where(ProductoCategoria.producto_id == producto.id)
    ).all()
    for rel in relaciones:
        session.delete(rel)
    session.delete(producto)
    session.commit()

def asignar_categoria_a_producto(
    session: Session,
    producto_id: int,
    categoria_id: int,
    es_principal: bool = False
) -> ProductoCategoria:
    relacion_existente = session.get(ProductoCategoria, (producto_id, categoria_id))
    if relacion_existente:
        relacion_existente.es_principal = es_principal
        session.add(relacion_existente)
        session.commit()
        session.refresh(relacion_existente)
        return relacion_existente
    relacion = ProductoCategoria(
        producto_id=producto_id,
        categoria_id=categoria_id,
        es_principal=es_principal
    )
    session.add(relacion)
    session.commit()
    session.refresh(relacion)
    return relacion

def get_categorias_de_producto(session: Session, producto_id: int) -> List[Categoria]:
    statement = (
        select(Categoria)
        .join(ProductoCategoria, ProductoCategoria.categoria_id == Categoria.id)
        .where(ProductoCategoria.producto_id == producto_id)
    )
    return list(session.exec(statement).all())

def eliminar_categoria_de_producto(session: Session, producto_id: int, categoria_id: int) -> bool:
    relacion = session.get(ProductoCategoria, (producto_id, categoria_id))
    if not relacion:
        return False
    session.delete(relacion)
    session.commit()
    return True
