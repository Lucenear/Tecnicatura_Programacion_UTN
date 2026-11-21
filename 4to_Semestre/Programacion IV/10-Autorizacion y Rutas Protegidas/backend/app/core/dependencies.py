from typing import List, Optional
import jwt
from fastapi import Depends, HTTPException, status
from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import oauth2_scheme
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.service import UsuarioService

usuario_service = UsuarioService()

def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Usuario:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalido",
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido o expirado",
        )

    usuario = usuario_service.get_by_email(email, include_deleted=True)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )
    return usuario

def get_current_active_user(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    if current_user.deleted_at is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cuenta de usuario desactivada",
        )
    return current_user

def require_role(roles_permitidos: List[str]):
    def dependency(current_user: Usuario = Depends(get_current_active_user)) -> Usuario:
        roles_usuario = usuario_service.get_usuario_roles(current_user.id, only_active=True)
        if not any(rol in roles_permitidos for rol in roles_usuario):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permisos insuficientes",
            )
        return current_user
    return dependency
