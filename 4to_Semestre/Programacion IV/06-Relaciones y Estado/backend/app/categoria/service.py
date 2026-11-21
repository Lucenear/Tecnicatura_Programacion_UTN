from typing import List, Optional
from sqlmodel import Session, select
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate
from app.producto.model import ProductoCategoria

def get_all_categorias(session: Session) -> List[Categoria]:
    statement = select(Categoria)
    return list(session.exec(statement).all())

def get_categoria_by_id(session: Session, categoria_id: int) -> Optional[Categoria]:
    return session.get(Categoria, categoria_id)

def create_categoria(session: Session, data: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(data)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def update_categoria(session: Session, categoria_id: int, data: CategoriaUpdate) -> Optional[Categoria]:
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        return None
    categoria_data = data.model_dump(exclude_unset=True)
    for key, value in categoria_data.items():
        setattr(categoria, key, value)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def delete_categoria(session: Session, categoria_id: int) -> bool:
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        return False
    relaciones = session.exec(
        select(ProductoCategoria).where(ProductoCategoria.categoria_id == categoria_id)
    ).all()
    for rel in relaciones:
        session.delete(rel)
    session.delete(categoria)
    session.commit()
    return True
