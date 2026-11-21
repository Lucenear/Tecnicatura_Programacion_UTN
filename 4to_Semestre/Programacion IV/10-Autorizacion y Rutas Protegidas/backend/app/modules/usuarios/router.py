from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.dependencies import get_current_active_user, require_role
from app.core.security import create_access_token
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import TokenResponse, UserCreate, UserPublic
from app.modules.usuarios.service import (
    CuentaDesactivada,
    CredencialesInvalidas,
    EmailDuplicado,
    UsuarioNoEncontrado,
    UsuarioService,
)

router = APIRouter(tags=["auth"])
service = UsuarioService()

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate):
    try:
        return service.registrar(data)
    except EmailDuplicado as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.post("/token", response_model=TokenResponse)
def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        usuario = service.autenticar(form_data.username, form_data.password)
    except CredencialesInvalidas as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except CuentaDesactivada as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    access_token = create_access_token(data={"sub": usuario.email})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=3600,
        path="/",
    )
    return TokenResponse(access_token=access_token, token_type="bearer")

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        samesite="lax",
    )
    return {"detail": "Sesion cerrada correctamente"}

@router.get("/me", response_model=UserPublic)
def me(current_user: Usuario = Depends(get_current_active_user)):
    return service.get_user_public(current_user.id)

@router.get("/admin/usuarios", response_model=List[UserPublic])
@router.get("/admin/users", response_model=List[UserPublic])
def list_usuarios(_: Usuario = Depends(require_role(["admin"]))):
    return service.get_all_users()

@router.post("/admin/usuarios/{id}/activar", response_model=UserPublic)
@router.post("/admin/users/{id}/activar", response_model=UserPublic)
@router.post("/admin/users/{id}/activate", response_model=UserPublic)
def activar_usuario(id: int, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.activar_usuario(id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/admin/usuarios/{id}/desactivar", response_model=UserPublic)
@router.post("/admin/users/{id}/desactivar", response_model=UserPublic)
@router.post("/admin/users/{id}/deactivate", response_model=UserPublic)
def desactivar_usuario(id: int, _: Usuario = Depends(require_role(["admin"]))):
    try:
        return service.desactivar_usuario(id)
    except UsuarioNoEncontrado as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
