from sqlmodel import Session, select
from app.core.database import engine, init_db
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.ingredientes.models import Ingrediente
from app.modules.pedidos.models import Pedido, DetallePedido

def seed_data():
    init_db()
    with Session(engine) as session:
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

        ingredientes = [
            Ingrediente(nombre="Pan de papa"),
            Ingrediente(nombre="Carne vacuna"),
            Ingrediente(nombre="Queso Cheddar"),
            Ingrediente(nombre="Lechuga"),
            Ingrediente(nombre="Tomate"),
            Ingrediente(nombre="Cebolla morada"),
            Ingrediente(nombre="Panceta crocante"),
            Ingrediente(nombre="Pepinillos"),
        ]

        for ing in ingredientes:
            existente = session.exec(select(Ingrediente).where(Ingrediente.nombre == ing.nombre)).first()
            if not existente:
                session.add(ing)
        session.commit()

        pedido_existente = session.exec(select(Pedido)).first()
        if not pedido_existente:
            p1 = session.exec(select(Producto).where(Producto.nombre == "Hamburguesa Simple")).first()
            p2 = session.exec(select(Producto).where(Producto.nombre == "Papas Fritas")).first()

            if p1 and p2:
                total = (1 * p1.precio_base) + (2 * p2.precio_base)
                pedido = Pedido(estado="CONFIRMADO", total=total)
                session.add(pedido)
                session.flush()

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
    print("Base de datos inicializada con datos de prueba")
