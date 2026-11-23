from datetime import datetime, timezone
from fastapi import HTTPException
from sqlmodel import Session, select, col
from app.modules.productos.model import Producto, ProductoCategoria
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoUpdate,
    ProductoPublic,
    ClasificarCategoriaRequest,
    ProductoCategoriaPublic,
    CategoriaProductoPublic,
)
from app.modules.categorias.model import Categoria
from app.modules.categorias.schema import CategoriaPublic
from app.modules.unidades_medida.model import UnidadMedida, TipoUnidad
from app.modules.unidades_medida.router import UnidadMedidaPublic

def validar_stock_contable(
    session: Session,
    unidad_venta_id: int,
    stock_cantidad: float,
) -> UnidadMedida:
    unidad = session.get(UnidadMedida, unidad_venta_id)
    if not unidad:
        raise HTTPException(status_code=404, detail="Unidad de medida no encontrada")

    if unidad.tipo == TipoUnidad.contable:
        if stock_cantidad % 1 != 0:
            raise HTTPException(
                status_code=422,
                detail="El stock para una unidad contable debe ser un numero entero",
            )
    return unidad

def construir_producto_public(producto: Producto) -> ProductoPublic:
    categorias_dto = [
        CategoriaPublic(
            id=c.id,
            nombre=c.nombre,
            descripcion=c.descripcion,
            activo=c.activo,
            anulado_at=c.anulado_at,
        )
        for c in producto.categorias
    ]
    unidad_dto = UnidadMedidaPublic(
        id=producto.unidad_venta.id,
        nombre=producto.unidad_venta.nombre,
        simbolo=producto.unidad_venta.simbolo,
        tipo=producto.unidad_venta.tipo,
    )
    return ProductoPublic(
        id=producto.id,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio_base=producto.precio_base,
        stock_cantidad=producto.stock_cantidad,
        disponible=producto.disponible,
        activo=producto.activo,
        anulado_at=producto.anulado_at,
        unidad_venta_id=producto.unidad_venta_id,
        unidad_venta=unidad_dto,
        categorias=categorias_dto,
        hay_stock=producto.stock_cantidad > 0,
    )

def crear_producto(session: Session, data: ProductoCreate) -> ProductoPublic:
    validar_stock_contable(session, data.unidad_venta_id, data.stock_cantidad)

    existente = session.exec(
        select(Producto).where(Producto.nombre == data.nombre, Producto.activo == True)
    ).first()
    if existente:
        raise HTTPException(status_code=409, detail="El nombre del producto ya existe")

    producto = Producto(
        nombre=data.nombre,
        descripcion=data.descripcion,
        precio_base=data.precio_base,
        unidad_venta_id=data.unidad_venta_id,
        stock_cantidad=data.stock_cantidad,
        disponible=data.disponible,
        activo=True,
        anulado_at=None,
    )
    session.add(producto)
    session.commit()
    session.refresh(producto)
    return construir_producto_public(producto)

def obtener_productos(
    session: Session,
    skip: int = 0,
    limit: int = 10,
    activo: bool | None = None,
    disponible: bool | None = None,
    categoria_id: int | None = None,
    search: str | None = None,
) -> list[ProductoPublic]:
    statement = select(Producto)

    if activo is None or activo is True:
        statement = statement.where(Producto.activo == True)
    elif activo is False:
        statement = statement.where(Producto.activo == False)

    if disponible is not None:
        statement = statement.where(Producto.disponible == disponible)

    if search is not None and search.strip():
        statement = statement.where(col(Producto.nombre).ilike(f"%{search.strip()}%"))

    if categoria_id is not None:
        statement = (
            statement.join(ProductoCategoria, Producto.id == ProductoCategoria.producto_id)
            .where(ProductoCategoria.categoria_id == categoria_id)
            .distinct()
        )

    statement = statement.order_by(Producto.id).offset(skip).limit(limit)
    productos = session.exec(statement).all()
    return [construir_producto_public(p) for p in productos]

def obtener_producto_por_id(session: Session, id: int) -> ProductoPublic:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return construir_producto_public(producto)

def actualizar_producto(
    session: Session, id: int, data: ProductoUpdate
) -> ProductoPublic:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if not producto.activo:
        raise HTTPException(status_code=409, detail="No se puede modificar un producto anulado")

    validar_stock_contable(session, data.unidad_venta_id, data.stock_cantidad)

    existente = session.exec(
        select(Producto).where(
            Producto.nombre == data.nombre,
            Producto.activo == True,
            Producto.id != id,
        )
    ).first()
    if existente:
        raise HTTPException(status_code=409, detail="El nombre del producto ya existe")

    producto.nombre = data.nombre
    producto.descripcion = data.descripcion
    producto.precio_base = data.precio_base
    producto.unidad_venta_id = data.unidad_venta_id
    producto.stock_cantidad = data.stock_cantidad
    producto.disponible = data.disponible

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return construir_producto_public(producto)

def anular_producto(session: Session, id: int) -> None:
    producto = session.get(Producto, id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if not producto.activo:
        raise HTTPException(status_code=409, detail="El producto ya se encuentra anulado")

    producto.activo = False
    producto.anulado_at = datetime.now(timezone.utc)
    session.add(producto)
    session.commit()

def clasificar_producto_en_categoria(
    session: Session, producto_id: int, data: ClasificarCategoriaRequest
) -> ProductoCategoriaPublic:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    categoria = session.get(Categoria, data.categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")

    if not producto.activo:
        raise HTTPException(status_code=409, detail="No se puede clasificar un producto anulado")

    if not categoria.activo:
        raise HTTPException(status_code=409, detail="No se puede clasificar en una categoria anulada")

    vinculo = session.get(ProductoCategoria, (producto_id, data.categoria_id))
    if vinculo:
        raise HTTPException(
            status_code=409, detail="El producto ya esta clasificado en esta categoria"
        )

    if data.es_principal:
        anteriores = session.exec(
            select(ProductoCategoria).where(
                ProductoCategoria.producto_id == producto_id,
                ProductoCategoria.es_principal == True,
            )
        ).all()
        for anterior in anteriores:
            anterior.es_principal = False
            session.add(anterior)

    nuevo_vinculo = ProductoCategoria(
        producto_id=producto_id,
        categoria_id=data.categoria_id,
        es_principal=data.es_principal,
    )
    session.add(nuevo_vinculo)
    session.commit()
    session.refresh(nuevo_vinculo)
    return ProductoCategoriaPublic(
        producto_id=nuevo_vinculo.producto_id,
        categoria_id=nuevo_vinculo.categoria_id,
        es_principal=nuevo_vinculo.es_principal,
    )

def obtener_categorias_de_producto(
    session: Session, producto_id: int
) -> list[CategoriaProductoPublic]:
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    statement = (
        select(Categoria, ProductoCategoria.es_principal)
        .join(ProductoCategoria, Categoria.id == ProductoCategoria.categoria_id)
        .where(ProductoCategoria.producto_id == producto_id)
    )
    filas = session.exec(statement).all()
    return [
        CategoriaProductoPublic(
            id=cat.id,
            nombre=cat.nombre,
            descripcion=cat.descripcion,
            activo=cat.activo,
            es_principal=es_principal,
        )
        for cat, es_principal in filas
    ]
