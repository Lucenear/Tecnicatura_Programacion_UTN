from sqlmodel import Session, select
from app.core.database import engine
from app.modules.unidades_medida.model import UnidadMedida, TipoUnidad

def seed_unidades_medida() -> None:
    with Session(engine) as session:
        statement = select(UnidadMedida)
        resultado = session.exec(statement).first()
        if resultado is None:
            unidades = [
                UnidadMedida(nombre="kilogramo", simbolo="kg", tipo=TipoUnidad.peso),
                UnidadMedida(nombre="gramo", simbolo="g", tipo=TipoUnidad.peso),
                UnidadMedida(nombre="litro", simbolo="L", tipo=TipoUnidad.volumen),
                UnidadMedida(nombre="mililitro", simbolo="mL", tipo=TipoUnidad.volumen),
                UnidadMedida(nombre="pieza", simbolo="u", tipo=TipoUnidad.contable),
                UnidadMedida(nombre="docena", simbolo="doc", tipo=TipoUnidad.contable),
            ]
            for unidad in unidades:
                session.add(unidad)
            session.commit()
