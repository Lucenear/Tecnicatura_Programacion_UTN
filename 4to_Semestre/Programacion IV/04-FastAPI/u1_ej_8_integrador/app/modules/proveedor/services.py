from typing import List, Optional
from .schemas import ProveedorCreate, ProveedorRead, ProveedorUpdate

db_proveedores: List[ProveedorRead] = []
id_counter = 1

def codigo_existe(codigo: str, exclude_id: Optional[int] = None) -> bool:
    for p in db_proveedores:
        if p.codigo == codigo and p.id != exclude_id:
            return True
    return False

def crear(data: ProveedorCreate) -> ProveedorRead:
    global id_counter
    nuevo = ProveedorRead(id=id_counter, **data.model_dump())
    db_proveedores.append(nuevo)
    id_counter += 1
    return nuevo

def obtener_todos(skip: int = 0, limit: int = 10, activo: Optional[bool] = None) -> List[ProveedorRead]:
    resultados = db_proveedores
    if activo is not None:
        resultados = [p for p in resultados if p.activo == activo]
    return resultados[skip : skip + limit]

def obtener_por_id(id: int) -> Optional[ProveedorRead]:
    for p in db_proveedores:
        if p.id == id:
            return p
    return None

def actualizar(id: int, data: ProveedorUpdate) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id:
            update_data = data.model_dump(exclude_unset=True)
            updated_item = p.model_copy(update=update_data)
            db_proveedores[index] = updated_item
            return updated_item
    return None

def desactivar(id: int) -> Optional[ProveedorRead]:
    for index, p in enumerate(db_proveedores):
        if p.id == id:
            p_dict = p.model_dump()
            p_dict["activo"] = False
            actualizada = ProveedorRead(**p_dict)
            db_proveedores[index] = actualizada
            return actualizada
    return None
