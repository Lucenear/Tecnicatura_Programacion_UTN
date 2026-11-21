from app.core.unit_of_work import BaseUnitOfWork
from app.modules.ingredientes.repository import IngredienteRepository

class IngredienteUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.ingredientes = IngredienteRepository(self.session)
        return self
