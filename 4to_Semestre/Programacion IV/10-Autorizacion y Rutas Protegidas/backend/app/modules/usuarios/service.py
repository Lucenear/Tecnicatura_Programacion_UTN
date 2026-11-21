from datetime import datetime, timezone
from typing import List, Optional
from app.core.security import get_password_hash, verify_password
from app.modules.usuarios.models import Usuario, Rol
from app.modules.usuarios.schemas import UserCreate, UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

class UsuarioNoEncontrado(Exception):
    def __init__(self, id_o_email: str):
        super().__init__(f"Usuario {id_o_email} no encontrado")

class EmailDuplicado(Exception):
    def __init__(self, email: str):
        super().__init__(f"El email '{email}' ya se encuentra registrado")

class CuentaDesactivada(Exception):
    def __init__(self):
        super().__init__("Cuenta de usuario desactivada")

class CredencialesInvalidas(Exception):
    def __init__(self):
        super().__init__("Credenciales invalidas")

class RolNoEncontrado(Exception):
    def __init__(self, rol: str):
        super().__init__(f"Rol '{rol}' no encontrado")

class UsuarioService:
    def __init__(self, uow: Optional[UsuarioUnitOfWork] = None):
        self._custom_uow = uow

    @property
    def uow(self) -> UsuarioUnitOfWork:
        return self._custom_uow or UsuarioUnitOfWork()

    def get_by_email(self, email: str, include_deleted: bool = False) -> Optional[Usuario]:
        with self.uow as uow:
            return uow.usuarios.get_by_email(email, include_deleted=include_deleted)

    def get_by_id(self, id: int, include_deleted: bool = False) -> Optional[Usuario]:
        with self.uow as uow:
            return uow.usuarios.get_by_id(id, include_deleted=include_deleted)

    def get_usuario_roles(self, usuario_id: int, only_active: bool = True) -> List[str]:
        with self.uow as uow:
            return uow.usuario_roles.get_roles_by_usuario(usuario_id, only_active=only_active)

    def registrar(self, data: UserCreate) -> UserPublic:
        with self.uow as uow:
            existente = uow.usuarios.get_by_email(data.email, include_deleted=True)
            if existente:
                raise EmailDuplicado(data.email)

            rol_user = uow.roles.get_by_nombre("user")
            if not rol_user:
                rol_user = uow.roles.create(Rol(nombre="user", descripcion="Usuario estandar"))

            nuevo_usuario = Usuario(
                nombre=data.nombre,
                apellido=data.apellido,
                email=data.email,
                celular=data.celular,
                password_hash=get_password_hash(data.password),
            )
            uow.usuarios.create(nuevo_usuario)
            uow.usuario_roles.asignar_rol(
                usuario_id=nuevo_usuario.id,
                rol_id=rol_user.id,
                asignado_por_id=None,
                expires_at=None,
            )
            return UserPublic(
                id=nuevo_usuario.id,
                nombre=nuevo_usuario.nombre,
                apellido=nuevo_usuario.apellido,
                email=nuevo_usuario.email,
                celular=nuevo_usuario.celular,
                roles=["user"],
                created_at=nuevo_usuario.created_at,
                updated_at=nuevo_usuario.updated_at,
                deleted_at=nuevo_usuario.deleted_at,
            )

    def autenticar(self, email: str, password: str) -> Usuario:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_email(email, include_deleted=True)
            if not usuario:
                raise CredencialesInvalidas()
            if not verify_password(password, usuario.password_hash):
                raise CredencialesInvalidas()
            if usuario.deleted_at is not None:
                raise CuentaDesactivada()
            return usuario

    def get_user_public(self, usuario_id: int) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id, include_deleted=True)
            if not usuario:
                raise UsuarioNoEncontrado(str(usuario_id))
            roles = uow.usuario_roles.get_roles_by_usuario(usuario.id, only_active=True)
            return UserPublic(
                id=usuario.id,
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                email=usuario.email,
                celular=usuario.celular,
                roles=roles,
                created_at=usuario.created_at,
                updated_at=usuario.updated_at,
                deleted_at=usuario.deleted_at,
            )

    def get_all_users(self) -> List[UserPublic]:
        with self.uow as uow:
            usuarios = uow.usuarios.get_all(include_deleted=True)
            resultado = []
            for u in usuarios:
                roles = uow.usuario_roles.get_roles_by_usuario(u.id, only_active=True)
                resultado.append(
                    UserPublic(
                        id=u.id,
                        nombre=u.nombre,
                        apellido=u.apellido,
                        email=u.email,
                        celular=u.celular,
                        roles=roles,
                        created_at=u.created_at,
                        updated_at=u.updated_at,
                        deleted_at=u.deleted_at,
                    )
                )
            return resultado

    def activar_usuario(self, id: int) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(id, include_deleted=True)
            if not usuario:
                raise UsuarioNoEncontrado(str(id))
            usuario.deleted_at = None
            usuario.updated_at = datetime.now(timezone.utc)
            uow.usuarios.update(usuario)
            roles = uow.usuario_roles.get_roles_by_usuario(usuario.id, only_active=True)
            return UserPublic(
                id=usuario.id,
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                email=usuario.email,
                celular=usuario.celular,
                roles=roles,
                created_at=usuario.created_at,
                updated_at=usuario.updated_at,
                deleted_at=usuario.deleted_at,
            )

    def desactivar_usuario(self, id: int) -> UserPublic:
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(id, include_deleted=True)
            if not usuario:
                raise UsuarioNoEncontrado(str(id))
            usuario.deleted_at = datetime.now(timezone.utc)
            usuario.updated_at = datetime.now(timezone.utc)
            uow.usuarios.update(usuario)
            roles = uow.usuario_roles.get_roles_by_usuario(usuario.id, only_active=True)
            return UserPublic(
                id=usuario.id,
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                email=usuario.email,
                celular=usuario.celular,
                roles=roles,
                created_at=usuario.created_at,
                updated_at=usuario.updated_at,
                deleted_at=usuario.deleted_at,
            )
