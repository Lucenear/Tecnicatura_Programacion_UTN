from sqlmodel import SQLModel, create_engine, Session, select
from app.categoria.model import Categoria

DATABASE_URL = "sqlite:///./database.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        statement = select(Categoria)
        if not session.exec(statement).first():
            iniciales = [
                Categoria(nombre="Pizzas", descripcion="Pizzas artesanales con masa fresca"),
                Categoria(nombre="Hamburguesas", descripcion="Hamburguesas gourmet con ingredientes frescos"),
                Categoria(nombre="Bebidas", descripcion="Gaseosas, jugos naturales y agua"),
                Categoria(nombre="Postres", descripcion="Helados, tortas y dulces artesanales"),
                Categoria(nombre="Entradas", descripcion="Empanadas, medialunas y snacks para compartir"),
                Categoria(nombre="Pastas", descripcion="Pastas frescas con salsas caseras")
            ]
            for item in iniciales:
                session.add(item)
            session.commit()

def get_session():
    with Session(engine) as session:
        yield session
