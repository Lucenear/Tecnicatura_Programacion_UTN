from app.core.unit_of_work import BaseUnitOfWork
from app.modules.productos.repository import ProductoRepository
from app.modules.categorias.repository import CategoriaRepository

class ProductoUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.productos = ProductoRepository(self.session)
        self.categorias = CategoriaRepository(self.session)
        return self
