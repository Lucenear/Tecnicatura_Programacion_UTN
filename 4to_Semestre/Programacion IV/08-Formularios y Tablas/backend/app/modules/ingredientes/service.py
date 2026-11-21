from typing import List
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
    def __init__(self, uow: IngredienteUnitOfWork = None):
        self.uow = uow or IngredienteUnitOfWork()

    def get_all(self) -> List[IngredienteRead]:
        with self.uow as uow:
            ingredientes = uow.ingredientes.get_all()
            return [IngredienteRead.model_validate(i) for i in ingredientes]

    def get_by_id(self, id: int) -> IngredienteRead:
        with self.uow as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontrado(id)
            return IngredienteRead.model_validate(ingrediente)

    def crear(self, data: IngredienteCreate) -> IngredienteRead:
        with self.uow as uow:
            existente = uow.ingredientes.get_by_nombre(data.nombre)
            if existente:
                raise IngredienteDuplicado(data.nombre)
            ingrediente = uow.ingredientes.create(
                Ingrediente(nombre=data.nombre)
            )
            return IngredienteRead.model_validate(ingrediente)

    def actualizar(self, id: int, data: IngredienteUpdate) -> IngredienteRead:
        with self.uow as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontrado(id)

            existente = uow.ingredientes.get_by_nombre(data.nombre)
            if existente and existente.id != id:
                raise IngredienteDuplicado(data.nombre)

            ingrediente.nombre = data.nombre
            uow.ingredientes.update(ingrediente)
            return IngredienteRead.model_validate(ingrediente)

    def eliminar(self, id: int) -> None:
        with self.uow as uow:
            ingrediente = uow.ingredientes.get_by_id(id)
            if not ingrediente:
                raise IngredienteNoEncontrado(id)
            uow.ingredientes.delete(ingrediente)
