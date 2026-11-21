from typing import List, Optional
from sqlmodel import Session, select
from app.categoria.model import Categoria
from app.categoria.schema import CategoriaCreate, CategoriaUpdate

def get_categorias(session: Session) -> List[Categoria]:
    statement = select(Categoria)
    return list(session.exec(statement).all())

def get_categoria_by_id(session: Session, categoria_id: int) -> Optional[Categoria]:
    return session.get(Categoria, categoria_id)

def create_categoria(session: Session, categoria_data: CategoriaCreate) -> Categoria:
    categoria = Categoria.model_validate(categoria_data)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def update_categoria(session: Session, categoria: Categoria, categoria_data: CategoriaUpdate) -> Categoria:
    datos = categoria_data.model_dump(exclude_unset=True)
    for clave, valor in datos.items():
        setattr(categoria, clave, valor)
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def delete_categoria(session: Session, categoria: Categoria) -> None:
    session.delete(categoria)
    session.commit()
