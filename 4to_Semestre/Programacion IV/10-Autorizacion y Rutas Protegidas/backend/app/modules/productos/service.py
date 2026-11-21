from datetime import datetime, timezone
from typing import List, Optional
from app.modules.productos.models import Producto
from app.modules.productos.schemas import ProductoCreate, ProductoUpdate, ProductoRead
from app.modules.productos.unit_of_work import ProductoUnitOfWork

class ProductoNoEncontrado(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"Producto con id {id} no encontrado")

class CategoriaInexistente(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"Categoria con id {id} no encontrada")

class ProductoService:
    def __init__(self, uow: Optional[ProductoUnitOfWork] = None):
        self._custom_uow = uow

    @property
    def uow(self) -> ProductoUnitOfWork:
        return self._custom_uow or ProductoUnitOfWork()

    def get_all(self) -> List[ProductoRead]:
        with self.uow as uow:
            productos = uow.productos.get_all()
            return [ProductoRead.model_validate(p) for p in productos]

    def get_by_id(self, id: int) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontrado(id)
            return ProductoRead.model_validate(producto)

    def crear(self, data: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            if data.categoria_id is not None:
                categoria = uow.categorias.get_by_id(data.categoria_id)
                if not categoria:
                    raise CategoriaInexistente(data.categoria_id)

            producto = uow.productos.create(
                Producto(
                    nombre=data.nombre,
                    descripcion=data.descripcion,
                    precio_base=data.precio_base,
                    disponible=data.disponible,
                    categoria_id=data.categoria_id,
                )
            )
            uow.productos.sincronizar_categoria_enlace(producto.id, data.categoria_id)
            return ProductoRead.model_validate(producto)

    def actualizar(self, id: int, data: ProductoUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontrado(id)

            if data.categoria_id is not None:
                categoria = uow.categorias.get_by_id(data.categoria_id)
                if not categoria:
                    raise CategoriaInexistente(data.categoria_id)
                producto.categoria_id = data.categoria_id
                uow.productos.sincronizar_categoria_enlace(producto.id, data.categoria_id)

            if data.nombre is not None:
                producto.nombre = data.nombre
            if data.descripcion is not None:
                producto.descripcion = data.descripcion
            if data.precio_base is not None:
                producto.precio_base = data.precio_base
            if data.disponible is not None:
                producto.disponible = data.disponible

            producto.updated_at = datetime.now(timezone.utc)
            uow.productos.update(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            producto = uow.productos.get_by_id(id)
            if not producto:
                raise ProductoNoEncontrado(id)

            producto.deleted_at = datetime.now(timezone.utc)
            producto.updated_at = datetime.now(timezone.utc)
            uow.productos.update(producto)
