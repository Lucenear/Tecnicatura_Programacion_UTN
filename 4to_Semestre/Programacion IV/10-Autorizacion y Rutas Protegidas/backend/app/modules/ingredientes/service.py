from datetime import datetime, timezone
from typing import List, Optional
from app.modules.ingredientes.models import Ingrediente
from app.modules.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteRead
from app.modules.ingredientes.unit_of_work import IngredienteUnitOfWork

class IngredienteNoEncontrado(Exception):
    def __init__(self, id: int):
        self.id = id
        super().__init__(f"Ingrediente con id {id} no encontrado")

class IngredienteDuplicado(Exception):
    def __init__(self, nombre: str):
        self.nombre = nombre
        super().__init__(f"Ya existe un ingrediente con el nombre '{nombre}'")

class IngredienteService:
    def __init__(self, uow: Optional[IngredienteUnitOfWork] = None):
        self._custom_uow = uow

    @property
    def uow(self) -> IngredienteUnitOfWork:
        return self._custom_uow or IngredienteUnitOfWork()

    def get_all(self) -> List[IngredienteRead]:
        with self.uow as uow:
            items = uow.ingredientes.get_all()
            return [IngredienteRead.model_validate(i) for i in items]

    def get_by_id(self, id: int) -> IngredienteRead:
        with self.uow as uow:
            item = uow.ingredientes.get_by_id(id)
            if not item:
                raise IngredienteNoEncontrado(id)
            return IngredienteRead.model_validate(item)

    def crear(self, data: IngredienteCreate) -> IngredienteRead:
        with self.uow as uow:
            existente = uow.ingredientes.get_by_nombre(data.nombre)
            if existente:
                raise IngredienteDuplicado(data.nombre)
            item = uow.ingredientes.create(
                Ingrediente(
                    nombre=data.nombre,
                    costo=data.costo,
                    stock=data.stock,
                    unidad=data.unidad,
                )
            )
            return IngredienteRead.model_validate(item)

    def actualizar(self, id: int, data: IngredienteUpdate) -> IngredienteRead:
        with self.uow as uow:
            item = uow.ingredientes.get_by_id(id)
            if not item:
                raise IngredienteNoEncontrado(id)

            if data.nombre is not None:
                existente = uow.ingredientes.get_by_nombre(data.nombre)
                if existente and existente.id != id:
                    raise IngredienteDuplicado(data.nombre)
                item.nombre = data.nombre

            if data.costo is not None:
                item.costo = data.costo

            if data.stock is not None:
                item.stock = data.stock

            if data.unidad is not None:
                item.unidad = data.unidad

            item.updated_at = datetime.now(timezone.utc)
            uow.ingredientes.update(item)
            return IngredienteRead.model_validate(item)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            item = uow.ingredientes.get_by_id(id)
            if not item:
                raise IngredienteNoEncontrado(id)

            item.deleted_at = datetime.now(timezone.utc)
            item.updated_at = datetime.now(timezone.utc)
            uow.ingredientes.update(item)
