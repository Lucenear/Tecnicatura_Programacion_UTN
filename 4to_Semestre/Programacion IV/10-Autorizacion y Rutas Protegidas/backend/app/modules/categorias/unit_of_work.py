from app.core.unit_of_work import BaseUnitOfWork
from app.modules.categorias.repository import CategoriaRepository
from app.modules.productos.repository import ProductoRepository

class CategoriaUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.categorias = CategoriaRepository(self.session)
        self.productos = ProductoRepository(self.session)
        return self
