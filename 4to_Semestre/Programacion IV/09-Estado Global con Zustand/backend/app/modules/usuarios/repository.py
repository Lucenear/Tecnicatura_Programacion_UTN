from datetime import datetime, timezone
from typing import List, Optional
from sqlmodel import Session, select, func, col
from app.core.repository import BaseRepository
from app.modules.usuarios.models import Usuario, Rol, UsuarioRol

class UsuarioRepository(BaseRepository[Usuario]):
    def __init__(self, session: Session):
        super().__init__(session, Usuario)

    def get_by_email(self, email: str, include_deleted: bool = False) -> Optional[Usuario]:
        statement = select(Usuario).where(func.lower(Usuario.email) == func.lower(email))
        if not include_deleted:
            statement = statement.where(Usuario.deleted_at.is_(None))
        return self.session.exec(statement).first()

    def get_by_id(self, id: int, include_deleted: bool = False) -> Optional[Usuario]:
        usuario = self.session.get(Usuario, id)
        if usuario and not include_deleted and usuario.deleted_at is not None:
            return None
        return usuario

    def get_all(self, include_deleted: bool = False) -> List[Usuario]:
        statement = select(Usuario)
        if not include_deleted:
            statement = statement.where(Usuario.deleted_at.is_(None))
        return list(self.session.exec(statement).all())

class RolRepository(BaseRepository[Rol]):
    def __init__(self, session: Session):
        super().__init__(session, Rol)

    def get_by_nombre(self, nombre: str) -> Optional[Rol]:
        statement = select(Rol).where(func.lower(Rol.nombre) == func.lower(nombre))
        return self.session.exec(statement).first()

class UsuarioRolRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_roles_by_usuario(self, usuario_id: int, only_active: bool = True) -> List[str]:
        statement = (
            select(Rol.nombre)
            .join(UsuarioRol, UsuarioRol.rol_id == Rol.id)
            .where(UsuarioRol.usuario_id == usuario_id)
        )
        if only_active:
            now = datetime.now(timezone.utc)
            statement = statement.where(
                (UsuarioRol.expires_at.is_(None)) | (UsuarioRol.expires_at > now)
            )
        return list(self.session.exec(statement).all())

    def asignar_rol(
        self,
        usuario_id: int,
        rol_id: int,
        asignado_por_id: Optional[int] = None,
        expires_at: Optional[datetime] = None,
    ) -> UsuarioRol:
        existente = self.session.exec(
            select(UsuarioRol).where(
                UsuarioRol.usuario_id == usuario_id,
                UsuarioRol.rol_id == rol_id,
            )
        ).first()
        if existente:
            existente.asignado_por_id = asignado_por_id
            existente.expires_at = expires_at
            self.session.add(existente)
            self.session.flush()
            return existente

        usuario_rol = UsuarioRol(
            usuario_id=usuario_id,
            rol_id=rol_id,
            asignado_por_id=asignado_por_id,
            expires_at=expires_at,
        )
        self.session.add(usuario_rol)
        self.session.flush()
        return usuario_rol

    def remover_rol(self, usuario_id: int, rol_id: int) -> None:
        existente = self.session.exec(
            select(UsuarioRol).where(
                UsuarioRol.usuario_id == usuario_id,
                UsuarioRol.rol_id == rol_id,
            )
        ).first()
        if existente:
            self.session.delete(existente)
            self.session.flush()
