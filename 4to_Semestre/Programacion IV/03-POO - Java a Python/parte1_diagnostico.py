import math


class Figura:
    def __init__(self, nombre, color):
        self.nombre = nombre
        self.color = color
        self._construida = True   # marca de que Figura.__init__ realmente corrió

    def area(self):
        return 0.0


class Lado:
    def __init__(self, longitud):
        self._longitud = longitud

    @property
    def longitud(self):
        return self._longitud

    @longitud.setter
    def longitud(self, valor):
        if valor <= 0:
            raise ValueError("La longitud debe ser positiva")
        self._longitud = valor


class Poligono(Figura):
    def __init__(self, nombre, color, lados=None, observaciones=None):
        super().__init__(nombre, color)
        
        self._lados = list(lados) if lados is not None else []
        self._observaciones = list(observaciones) if observaciones is not None else []

    def lados_esperados(self):
        return 0

    def perimetro(self):
        return sum(l.longitud for l in self._lados)

    def area(self) -> str:
        return "area sin calcular"

    def agregar_observacion(self, texto):
        self._observaciones.append(texto)

    def lados(self):
        # Aplico copia y devuelvo una tupla para proteger la lista
        return tuple(self._lados)


class Triangulo(Poligono):
    def __init__(self, nombre="triángulo", color="negro", lados=None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self):
        return 3


class Cuadrado(Poligono):
    def __init__(self, nombre="cuadrado", color="negro", lados=None):
        super().__init__(nombre, color, lados)

    def lados_esperados(self):
        return 4


class PoligonoRegular(Poligono):
    """Poligono de N lados de igual longitud
    """

    def __init__(self, nombre, color, medida, cantidad):
        super().__init__(nombre, color, [Lado(medida) for _ in range(cantidad)])
        self._cantidad = cantidad

    def lados_esperados(self):
        return self._cantidad


if __name__ == "__main__":
    activo = True
    if activo:
        t = Triangulo("Triángulo", "rojo", [Lado(3), Lado(4), Lado(5)])
        c = Cuadrado("Cuadrado", "azul", [Lado(2), Lado(2), Lado(2), Lado(2)])
        
        print(f"Perímetro del triángulo: {t.perimetro()}")
        print(f"Perímetro del cuadrado: {c.perimetro()}")
        
        t.agregar_observacion("revisar el vértice A")
        
        print(f"Nombre (acceso directo): {t.nombre}")
        
        r = PoligonoRegular("Pentágono", "verde", 4, 5)
        print(f"Perímetro del pentágono: {r.perimetro()}")
