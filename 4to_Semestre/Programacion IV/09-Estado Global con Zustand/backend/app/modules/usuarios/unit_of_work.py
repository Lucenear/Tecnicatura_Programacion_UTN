from app.core.unit_of_work import BaseUnitOfWork
from app.modules.usuarios.repository import (
    UsuarioRepository,
    RolRepository,
    UsuarioRolRepository,
)

class UsuarioUnitOfWork(BaseUnitOfWork):
    def __enter__(self):
        super().__enter__()
        self.usuarios = UsuarioRepository(self.session)
        self.roles = RolRepository(self.session)
        self.usuario_roles = UsuarioRolRepository(self.session)
        return self
