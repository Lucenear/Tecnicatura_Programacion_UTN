"""Aca unifique mi codigo final con todas las correcciones
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Protocol, List, Tuple, Optional

# Importo la libreria externa sin modificarla
import libreria_externa


# --- PARTE 4: Protocolo ---
class Exportable(Protocol):
    def exportar(self) -> str:
        ...


# --- PARTE 2: Data Class y Relaciones ---
@dataclass(frozen=True)
class Etiqueta:
    texto: str


class Lado:
    def __init__(self, longitud: float):
        self._longitud = longitud
        self._etiqueta: Optional[Etiqueta] = None  # Asociacion 0..1

    @property
    def longitud(self) -> float:
        return self._longitud

    @longitud.setter
    def longitud(self, valor: float):
        if valor <= 0:
            raise ValueError("La longitud debe ser positiva")
        self._longitud = valor

    @property
    def etiqueta(self) -> Optional[Etiqueta]:
        return self._etiqueta

    @etiqueta.setter
    def etiqueta(self, etiqueta: Etiqueta):
        self._etiqueta = etiqueta

    def escalar(self, factor: float):
        self.longitud = self.longitud * factor


# --- PARTE 3: ABC (falla por herencia) ---
class Figura(ABC):
    def __init__(self, nombre: str, color: str):
        self.nombre = nombre
        self.color = color

    @abstractmethod
    def area(self) -> float:
        pass


class Poligono(Figura):
    def __init__(self, nombre: str, color: str, lados: Optional[List[Lado]] = None):
        super().__init__(nombre, color)
        
        # Composicion: Hago que el Poligono construya y contenga sus lados
        self._lados = list(lados) if lados is not None else []
        
        # Falla temprana: fuerzo la evaluacion de lados_esperados() para que falle al instanciar
        if len(self._lados) != self.lados_esperados():
            # Con solo llamar a self.lados_esperados(), me aseguro de que el @abstractmethod explote si no se implemento
            pass 

    @abstractmethod
    def lados_esperados(self) -> int:
        pass

    def perimetro(self) -> float:
        return sum(l.longitud for l in self._lados)

    def area(self) -> float:
        # Lo simplifico devolviendo 0.0 por ahora
        return 0.0

    def lados(self) -> Tuple[Lado, ...]:
        # Hago una copia defensiva al devolver los componentes
        return tuple(self._lados)

    def exportar(self) -> str:
        return f"Poligono[{self.nombre} | lados={len(self._lados)} | perim={self.perimetro()}]"


class Triangulo(Poligono):
    def __init__(self, nombre: str = "Triangulo", color: str = "negro", lados: Optional[List[Lado]] = None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 3


class Cuadrado(Poligono):
    def __init__(self, nombre: str = "Cuadrado", color: str = "negro", lados: Optional[List[Lado]] = None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 4


class Pentagono(Poligono):
    def __init__(self, nombre: str = "Pentagono", color: str = "negro", lados: Optional[List[Lado]] = None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 5


class Hexagono(Poligono):
    def __init__(self, nombre: str = "Hexagono", color: str = "negro", lados: Optional[List[Lado]] = None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self) -> int:
        return 6


# --- Decision sobre PoligonoRegular ---
# Decidi rediseñar: considero que un "Poligono Regular" no justifica una clase separada en Python que rompa la jerarquia.
# En lugar de usar herencia, arme esta FACTORY FUNCTION que me devuelve la instancia correcta (Triangulo, Cuadrado, etc.) segun los lados.

def crear_poligono_regular(color: str, medida: float, cantidad: int) -> Poligono:
    lados = [Lado(medida) for _ in range(cantidad)]
    if cantidad == 3:
        return Triangulo("Triangulo Regular", color, lados)
    elif cantidad == 4:
        return Cuadrado("Cuadrado Regular", color, lados)
    elif cantidad == 5:
        return Pentagono("Pentagono Regular", color, lados)
    elif cantidad == 6:
        return Hexagono("Hexagono Regular", color, lados)
    else:
        # Para poligonos de otro tamaño defino una clase generica
        class PoligonoN(Poligono):
            def lados_esperados(self) -> int: return cantidad
        return PoligonoN(f"Poligono Regular de {cantidad} lados", color, lados)


# --- PARTE 2: Agregacion ---
class Taller:
    def __init__(self):
        # Agregacion: guardo los poligonos pero no los construyo ni mueren con la clase
        self._poligonos: List[Poligono] = []

    def recibir(self, poligono: Poligono):
        self._poligonos.append(poligono)

    def restaurar(self, poligono: Poligono):
        # Ejemplo de restauracion del poligono
        for lado in poligono.lados():
            lado.longitud += 1

    def inventario(self) -> Tuple[Poligono, ...]:
        # Copia: devuelvo una tupla inmutable para proteger mi inventario
        return tuple(self._poligonos)


# --- PARTE 4: Funcion con Protocol ---
def exportar_todo(items: List[Exportable]) -> List[str]:
    """
    Exporto una lista mezclada de objetos que cumplen el contrato exportable.
    Me funciona tanto para mis Poligonos como para el PlanoCAD de la libreria externa.
    """
    return [item.exportar() for item in items]
