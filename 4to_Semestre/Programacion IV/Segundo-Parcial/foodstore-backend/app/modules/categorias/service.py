from datetime import datetime, timezone
from fastapi import HTTPException
from sqlmodel import Session, select, col
from app.modules.categorias.model import Categoria
from app.modules.categorias.schema import CategoriaCreate, CategoriaUpdate

def crear_categoria(session: Session, data: CategoriaCreate) -> Categoria:
    existente = session.exec(
        select(Categoria).where(Categoria.nombre == data.nombre, Categoria.activo == True)
    ).first()
    if existente:
        raise HTTPException(status_code=409, detail="El nombre de la categoria ya existe")

    categoria = Categoria(
        nombre=data.nombre,
        descripcion=data.descripcion,
        activo=True,
        anulado_at=None,
    )
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def obtener_categorias(
    session: Session,
    activo: bool | None = None,
    search: str | None = None,
) -> list[Categoria]:
    statement = select(Categoria)

    if activo is None or activo is True:
        statement = statement.where(Categoria.activo == True)
    elif activo is False:
        statement = statement.where(Categoria.activo == False)

    if search is not None and search.strip():
        statement = statement.where(col(Categoria.nombre).ilike(f"%{search.strip()}%"))

    return list(session.exec(statement).all())

def obtener_categoria_por_id(session: Session, id: int) -> Categoria:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria

def actualizar_categoria(session: Session, id: int, data: CategoriaUpdate) -> Categoria:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")

    if not categoria.activo:
        raise HTTPException(status_code=409, detail="No se puede modificar una categoria anulada")

    existente = session.exec(
        select(Categoria).where(
            Categoria.nombre == data.nombre,
            Categoria.activo == True,
            Categoria.id != id,
        )
    ).first()
    if existente:
        raise HTTPException(status_code=409, detail="El nombre de la categoria ya existe")

    categoria.nombre = data.nombre
    categoria.descripcion = data.descripcion
    session.add(categoria)
    session.commit()
    session.refresh(categoria)
    return categoria

def anular_categoria(session: Session, id: int) -> None:
    categoria = session.get(Categoria, id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")

    if not categoria.activo:
        raise HTTPException(status_code=409, detail="La categoria ya se encuentra anulada")

    categoria.activo = False
    categoria.anulado_at = datetime.now(timezone.utc)
    session.add(categoria)
    session.commit()
