from sqlmodel import Session, select
from app.core.database import engine, init_db
from app.core.security import get_password_hash
from app.modules.usuarios.models import Usuario, Rol, UsuarioRol
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto, ProductoCategoria
from app.modules.ingredientes.models import Ingrediente
from app.modules.pedidos.models import FormaPago, EstadoPedido, Pedido, DetallePedido

def seed_data():
    init_db()
    with Session(engine) as session:
        roles_data = [
            ("admin", "Administrador del sistema con acceso total"),
            ("user", "Usuario estandar cliente"),
        ]
        for nombre, descripcion in roles_data:
            existente = session.exec(select(Rol).where(Rol.nombre == nombre)).first()
            if not existente:
                session.add(Rol(nombre=nombre, descripcion=descripcion))
        session.commit()

        rol_admin = session.exec(select(Rol).where(Rol.nombre == "admin")).first()
        rol_user = session.exec(select(Rol).where(Rol.nombre == "user")).first()

        admin_existente = session.exec(
            select(Usuario).where(Usuario.email == "admin@foodstore.com")
        ).first()
        if not admin_existente:
            admin_user = Usuario(
                nombre="Administrador",
                apellido="General",
                email="admin@foodstore.com",
                celular="1122334455",
                password_hash=get_password_hash("admin1234"),
            )
            session.add(admin_user)
            session.commit()
            session.refresh(admin_user)
            session.add(
                UsuarioRol(
                    usuario_id=admin_user.id,
                    rol_id=rol_admin.id,
                    asignado_por_id=None,
                    expires_at=None,
                )
            )
            session.commit()

        user_existente = session.exec(
            select(Usuario).where(Usuario.email == "user@foodstore.com")
        ).first()
        if not user_existente:
            std_user = Usuario(
                nombre="Juan",
                apellido="Perez",
                email="user@foodstore.com",
                celular="1199887766",
                password_hash=get_password_hash("user1234"),
            )
            session.add(std_user)
            session.commit()
            session.refresh(std_user)
            session.add(
                UsuarioRol(
                    usuario_id=std_user.id,
                    rol_id=rol_user.id,
                    asignado_por_id=None,
                    expires_at=None,
                )
            )
            session.commit()

        formas_pago = [
            ("EFECTIVO", "Pago en efectivo contra entrega", True),
            ("TARJETA_CREDITO", "Tarjeta de credito online", True),
            ("TARJETA_DEBITO", "Tarjeta de debito online", True),
            ("MERCADO_PAGO", "Billetera virtual Mercado Pago", True),
        ]
        for codigo, descripcion, activo in formas_pago:
            existente = session.exec(select(FormaPago).where(FormaPago.codigo == codigo)).first()
            if not existente:
                session.add(FormaPago(codigo=codigo, descripcion=descripcion, activo=activo))
        session.commit()

        estados_pedido = [
            ("PENDIENTE", "Pedido recibido", 1, False),
            ("CONFIRMADO", "Pedido confirmado", 2, False),
            ("EN_PREP", "En preparacion", 3, False),
            ("EN_CAMINO", "En camino a entrega", 4, False),
            ("ENTREGADO", "Pedido entregado", 5, True),
            ("CANCELADO", "Pedido cancelado", 6, True),
        ]
        for codigo, descripcion, orden, es_terminal in estados_pedido:
            existente = session.exec(select(EstadoPedido).where(EstadoPedido.codigo == codigo)).first()
            if not existente:
                session.add(
                    EstadoPedido(
                        codigo=codigo,
                        descripcion=descripcion,
                        orden=orden,
                        es_terminal=es_terminal,
                    )
                )
        session.commit()

        categorias = [
            Categoria(nombre="Hamburguesas", descripcion="Hamburguesas caseras"),
            Categoria(nombre="Bebidas", descripcion="Bebidas frias y refrescos"),
            Categoria(nombre="Acompañamientos", descripcion="Guarniciones y complementos"),
            Categoria(nombre="Postres", descripcion="Postres y dulces"),
        ]
        for cat in categorias:
            existente = session.exec(select(Categoria).where(Categoria.nombre == cat.nombre)).first()
            if not existente:
                session.add(cat)
        session.commit()

        cat_hamb = session.exec(select(Categoria).where(Categoria.nombre == "Hamburguesas")).first()
        cat_beb = session.exec(select(Categoria).where(Categoria.nombre == "Bebidas")).first()
        cat_acomp = session.exec(select(Categoria).where(Categoria.nombre == "Acompañamientos")).first()

        productos = [
            Producto(
                nombre="Hamburguesa Simple",
                descripcion="Hamburguesa con carne y queso",
                precio_base=1500.0,
                disponible=True,
                categoria_id=cat_hamb.id if cat_hamb else None,
            ),
            Producto(
                nombre="Hamburguesa Doble",
                descripcion="Doble carne con queso cheddar y panceta",
                precio_base=2200.0,
                disponible=True,
                categoria_id=cat_hamb.id if cat_hamb else None,
            ),
            Producto(
                nombre="Papas Fritas",
                descripcion="Porcion clasica de papas",
                precio_base=900.0,
                disponible=True,
                categoria_id=cat_acomp.id if cat_acomp else None,
            ),
            Producto(
                nombre="Gaseosa Cola",
                descripcion="Bebida sabor cola 500ml",
                precio_base=600.0,
                disponible=True,
                categoria_id=cat_beb.id if cat_beb else None,
            ),
        ]

        for prod in productos:
            existente = session.exec(select(Producto).where(Producto.nombre == prod.nombre)).first()
            if not existente:
                session.add(prod)
                session.commit()
                session.refresh(prod)
                if prod.categoria_id:
                    session.add(
                        ProductoCategoria(
                            producto_id=prod.id,
                            categoria_id=prod.categoria_id,
                            es_principal=True,
                        )
                    )
                    session.commit()

        ingredientes_data = [
            Ingrediente(nombre="Carne vacuna", costo=800.0, stock=50, unidad="kg"),
            Ingrediente(nombre="Pan de hamburguesa", costo=150.0, stock=100, unidad="u"),
            Ingrediente(nombre="Queso cheddar", costo=400.0, stock=40, unidad="kg"),
            Ingrediente(nombre="Panceta", costo=550.0, stock=30, unidad="kg"),
            Ingrediente(nombre="Papas", costo=300.0, stock=80, unidad="kg"),
            Ingrediente(nombre="Tomate", costo=250.0, stock=25, unidad="kg"),
        ]
        for ing in ingredientes_data:
            existente = session.exec(select(Ingrediente).where(Ingrediente.nombre == ing.nombre)).first()
            if not existente:
                session.add(ing)
        session.commit()

        pedido_existente = session.exec(select(Pedido)).first()
        if not pedido_existente:
            p1 = session.exec(select(Producto).where(Producto.nombre == "Hamburguesa Simple")).first()
            p2 = session.exec(select(Producto).where(Producto.nombre == "Papas Fritas")).first()
            user_inst = session.exec(select(Usuario).where(Usuario.email == "user@foodstore.com")).first()

            if p1 and p2 and user_inst:
                total = (1 * p1.precio_base) + (2 * p2.precio_base)
                pedido = Pedido(
                    usuario_id=user_inst.id,
                    estado="CONFIRMADO",
                    total=total,
                )
                session.add(pedido)
                session.commit()
                session.refresh(pedido)

                d1 = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=p1.id,
                    cantidad=1,
                    precio_unitario=p1.precio_base,
                )
                d2 = DetallePedido(
                    pedido_id=pedido.id,
                    producto_id=p2.id,
                    cantidad=2,
                    precio_unitario=p2.precio_base,
                )
                session.add(d1)
                session.add(d2)
                session.commit()

if __name__ == "__main__":
    seed_data()
    print("Base de datos inicializada correctamente")
