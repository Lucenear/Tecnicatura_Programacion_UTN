from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Protocol, List, Tuple, Optional

class Exportable(Protocol):
    def exportar(self) -> str:
        ...

@dataclass(frozen=True)
class UnidadMedida:
    nombre: str
    simbolo: str
    tipo: str

class DominioError(ValueError):
    pass

class Categoria:
    def __init__(self, nombre: str, descripcion: str = ""):
        self._nombre = nombre
        self._descripcion = descripcion

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def descripcion(self) -> str:
        return self._descripcion

class ProductoCategoria:
    def __init__(self, categoria: Categoria, es_principal: bool):
        self._categoria = categoria
        self._es_principal = es_principal

    @property
    def categoria(self) -> Categoria:
        return self._categoria

    @property
    def es_principal(self) -> bool:
        return self._es_principal

    def _marcar_principal(self, valor: bool) -> None:
        self._es_principal = valor

class Producto(ABC):
    def __init__(self, nombre: str, precio_base: float, stock_cantidad: float, unidad_venta: Optional[UnidadMedida], categoria_principal: Categoria, orden_vidriera: Optional[int] = None):
        if not nombre:
            raise DominioError("El nombre no puede estar vacio.")
        if precio_base < 0:
            raise DominioError("El precio_base no puede ser negativo.")
        if stock_cantidad < 0:
            raise DominioError("El stock_cantidad no puede ser negativo.")

        self._nombre = nombre
        self._precio_base = precio_base
        self._stock_cantidad = stock_cantidad
        self._habilitado = True
        self._unidad_venta = unidad_venta
        self._clasificaciones: List[ProductoCategoria] = []
        self._orden_vidriera = orden_vidriera
        self.clasificar_en(categoria_principal, es_principal=True)

    @property
    def nombre(self) -> str:
        return self._nombre

    @property
    def precio_base(self) -> float:
        return self._precio_base

    @property
    def unidad_venta(self) -> Optional[UnidadMedida]:
        return self._unidad_venta

    @property
    def disponible(self) -> bool:
        return self._habilitado and self._stock_cantidad > 0

    @property
    def precio_publicado(self) -> str:
        if self._unidad_venta:
            return f"$ {self._precio_base:.2f} / {self._unidad_venta.simbolo}"
        return f"$ {self._precio_base:.2f}"

    def habilitar(self) -> None:
        self._habilitado = True

    def deshabilitar(self) -> None:
        self._habilitado = False

    def clasificar_en(self, categoria: Categoria, es_principal: bool = False) -> None:
        for pc in self._clasificaciones:
            if pc.categoria == categoria:
                raise DominioError("El producto ya esta clasificado en esta categoria.")
        
        if es_principal:
            for pc in self._clasificaciones:
                pc._marcar_principal(False)
        
        nuevo_vinculo = ProductoCategoria(categoria, es_principal)
        self._clasificaciones.append(nuevo_vinculo)

    def categorias(self) -> Tuple[ProductoCategoria, ...]:
        return tuple(self._clasificaciones)

    def categoria_principal(self) -> Categoria:
        for pc in self._clasificaciones:
            if pc.es_principal:
                return pc.categoria
        raise DominioError("El producto no tiene categoria principal.")

    @abstractmethod
    def precio_final(self, cantidad: float) -> float:
        pass

    def exportar(self) -> str:
        return f"PROD|{self._nombre}|{self._precio_base:.2f}"

class ProductoSimple(Producto):
    def precio_final(self, cantidad: float) -> float:
        if not isinstance(cantidad, (int, float)) or int(cantidad) != cantidad or cantidad < 1:
            raise DominioError("La cantidad debe ser un entero >= 1.")
        return self._precio_base * cantidad

class ProductoPorPeso(Producto):
    def precio_final(self, cantidad: float) -> float:
        if cantidad <= 0:
            raise DominioError("La cantidad debe ser > 0.")
        return round(self._precio_base * cantidad, 2)

class ProductoCombo(Producto):
    def __init__(self, nombre: str, descuento: float, componentes: List[Producto], categoria_principal: Categoria, orden_vidriera: Optional[int] = None):
        if len(componentes) < 2:
            raise DominioError("Un combo debe tener al menos 2 componentes.")
        if not (0 <= descuento < 1):
            raise DominioError("El descuento debe estar en [0, 1).")
        
        self._componentes = list(componentes)
        self._descuento = descuento
        
        precio_base = sum(comp.precio_final(1) for comp in self._componentes)
        
        min_stock = float('inf')
        for comp in self._componentes:
            if comp._stock_cantidad < min_stock:
                min_stock = comp._stock_cantidad
        
        super().__init__(nombre, precio_base, min_stock, None, categoria_principal, orden_vidriera)

    def componentes(self) -> Tuple[Producto, ...]:
        return tuple(self._componentes)

    def precio_final(self, cantidad: float) -> float:
        if not isinstance(cantidad, (int, float)) or int(cantidad) != cantidad or cantidad < 1:
            raise DominioError("La cantidad debe ser un entero >= 1.")
        
        precio_base_componentes = sum(c.precio_final(1) for c in self._componentes)
        return precio_base_componentes * (1 - self._descuento) * cantidad

def exportar_catalogo(items: List[Exportable]) -> List[str]:
    return [item.exportar() for item in items]
