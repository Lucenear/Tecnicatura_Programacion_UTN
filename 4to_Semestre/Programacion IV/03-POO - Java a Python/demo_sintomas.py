"""Aislo y muestro 2 de los 8 sintomas del codigo original
"""

class LadoOriginal:
    def __init__(self, longitud):
        self._longitud = longitud

# Copie la firma y asignacion original para la demo
class PoligonoOriginal:
    def __init__(self, nombre, lados=[], observaciones=[]):
        self._nombre = nombre
        # Sintoma 2: Guardo la referencia sin hacer copia
        self._lados = lados
        self._observaciones = observaciones

    def agregar_observacion(self, texto):
        self._observaciones.append(texto)


def sintoma_argumento_por_defecto_mutable():
    print("--- Sintoma 1: Argumento por defecto mutable ---")
    
    # Ambos poligonos usan la misma lista [] por defecto
    p1 = PoligonoOriginal("Poligono 1")
    p2 = PoligonoOriginal("Poligono 2")
    
    p1.agregar_observacion("Observacion exclusiva para p1")
    
    print(f"Observaciones p1: {p1._observaciones}")
    print(f"Observaciones p2: {p2._observaciones}")
    
    is_same = p1._observaciones is p2._observaciones
    print(f"p1._observaciones is p2._observaciones? -> {is_same}")
    
    if is_same:
        print(">> SiITOMA DEMOSTRADO: Mutar las observaciones de p1 muto las de p2 porque comparten la lista en memoria\n")


def sintoma_alias_de_lista_sin_copia():
    print("--- Sintoma 2: Alias de lista sin copia ---")
    
    lados_externos = [LadoOriginal(10), LadoOriginal(10), LadoOriginal(10)]
    
    # Le paso la lista externa al poligono
    triangulo = PoligonoOriginal("Triangulo", lados=lados_externos)
    
    print(f"Lados iniciales en el triangulo: {len(triangulo._lados)}")
    
    # Simulo ser el cliente y vacio la lista externa despues de construir el poligono
    print("El codigo cliente vacia la lista externa 'lados_externos'...")
    lados_externos.clear()
    
    print(f"Lados que le quedaron al triangulo: {len(triangulo._lados)}")
    
    if len(triangulo._lados) == 0:
        print(">> SINTOMA DEMOSTRADO: El poligono perdio sus lados porque guardo un alias en lugar de hacer copia (list(lados)).\n")


if __name__ == "__main__":
    sintoma_argumento_por_defecto_mutable()
    sintoma_alias_de_lista_sin_copia()
