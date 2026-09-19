from figuras import (
    Taller, Triangulo, Cuadrado, Pentagono, Hexagono,
    Poligono, Lado, Etiqueta, exportar_todo, crear_poligono_regular
)
from libreria_externa import PlanoCAD
import gc

def demo_falla_temprana():
    print("--- 1. Demo Falla Temprana (ABC) ---")
    try:
        class PoligonoRoto(Poligono):
            pass # Me olvido a proposito de implementar lados_esperados()
        
        # Al instanciarlo el programa revienta inmediatamente
        _ = PoligonoRoto("Roto", "gris")
    except TypeError as e:
        print(f"EXITO: Fallo temprano! ==> Error: {e}\n")


def demo_relaciones():
    print("--- 2. Demo Relaciones (Composicion vs Agregacion) ---")
    taller = Taller()
    
    # Creo un poligono (Composicion: el mismo construye y controla sus lados) y lo agrego al taller (Agregacion: el Taller solo guarda la referencia).
    t1 = Triangulo("Triangulo1", "rojo", [Lado(10), Lado(10), Lado(10)])
    taller.recibir(t1)
    
    # Compruebo:
    # 1. Agregacion: borro mi Taller pero el Poligono sobrevive
    del taller
    print(f"Taller fue borrado, pero el {t1.nombre} sobrevive: perimetro={t1.perimetro()}")
    
    # 2. Composicion: borro mi Poligono por lo que sus lados mueren con el
    # Como los instancie directamente al crearlo el Poligono es su unico dueño
    import weakref

    ref_lado = weakref.ref(t1.lados()[0])
    print(f"Antes de borrar el poligono, el lado existe: {ref_lado() is not None}")
    
    del t1
    gc.collect() # Fuerzo la recoleccion
    print(f"Despues de borrar el poligono, el lado existe: {ref_lado() is not None}\n")


def demo_taller_y_exportacion():
    print("--- 3. Taller, Etiquetas y Exportacion ---")
    taller = Taller()
    
    # Instancio los 4 poligonos (uno de cada subclase)
    t = Triangulo("Triangulo", "rojo", [Lado(3), Lado(4), Lado(5)])
    c = Cuadrado("Cuadrado", "azul", [Lado(2), Lado(2), Lado(2), Lado(2)])
    p = Pentagono("Pentagono", "verde", [Lado(5) for _ in range(5)])
    h = Hexagono("Hexagono", "amarillo", [Lado(6) for _ in range(6)])
    
    # Etiqueto 2 lados para probar la Asociacion
    t.lados()[0].etiqueta = Etiqueta("Hipotenusa")
    c.lados()[0].etiqueta = Etiqueta("Base")
    
    taller.recibir(t)
    taller.recibir(c)
    taller.recibir(p)
    taller.recibir(h)
    
    print("Inventario del Taller:")
    for poligono in taller.inventario():
        print(f" - {poligono.nombre}")
        
    # Reviso el rediseño
    r = crear_poligono_regular("naranja", 10.0, 3) # Un triangulo regular
    taller.recibir(r)
        
    print("\nExportacion Mixta (Protocol 'Exportable'):")
    # Mezclo los poligonos con el PlanoCAD
    plano = PlanoCAD("Planta Baja", "1:50")
    
    elementos_exportables = list(taller.inventario()) + [plano]
    
    resultados = exportar_todo(elementos_exportables)
    for res in resultados:
        print(res)

if __name__ == "__main__":
    demo_falla_temprana()
    demo_relaciones()
    demo_taller_y_exportacion()
