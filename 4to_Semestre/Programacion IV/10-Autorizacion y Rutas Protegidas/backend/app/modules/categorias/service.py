from datetime import datetime, timezone
from typing import List, Optional
from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaRead
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork

class CategoriaNoEncontrada(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"Categoria con id {id} no encontrada")

class CategoriaDuplicada(Exception):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe una categoria con el nombre '{nombre}'")

class CategoriaConProductos(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"No se puede eliminar la categoria {id} porque tiene productos asociados")

class CategoriaService:
    def __init__(self, uow: Optional[CategoriaUnitOfWork] = None):
        self._custom_uow = uow

    @property
    def uow(self) -> CategoriaUnitOfWork:
        return self._custom_uow or CategoriaUnitOfWork()

    def get_all(self) -> List[CategoriaRead]:
        with self.uow as uow:
            categorias = uow.categorias.get_all()
            return [CategoriaRead.model_validate(c) for c in categorias]

    def get_by_id(self, id: int) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontrada(id)
            return CategoriaRead.model_validate(categoria)

    def crear(self, data: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            existente = uow.categorias.get_by_nombre(data.nombre)
            if existente:
                raise CategoriaDuplicada(data.nombre)
            categoria = uow.categorias.create(
                Categoria(nombre=data.nombre, descripcion=data.descripcion)
            )
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, id: int, data: CategoriaUpdate) -> CategoriaRead:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontrada(id)

            if data.nombre is not None:
                existente = uow.categorias.get_by_nombre(data.nombre)
                if existente and existente.id != id:
                    raise CategoriaDuplicada(data.nombre)
                categoria.nombre = data.nombre

            if data.descripcion is not None:
                categoria.descripcion = data.descripcion

            categoria.updated_at = datetime.now(timezone.utc)
            uow.categorias.update(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            categoria = uow.categorias.get_by_id(id)
            if not categoria:
                raise CategoriaNoEncontrada(id)

            productos = uow.productos.get_by_categoria(id)
            if len(productos) > 0:
                raise CategoriaConProductos(id)

            categoria.deleted_at = datetime.now(timezone.utc)
            categoria.updated_at = datetime.now(timezone.utc)
            uow.categorias.update(categoria)
