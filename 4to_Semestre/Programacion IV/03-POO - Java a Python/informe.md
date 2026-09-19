# Informe del Trabajo Practico Integrador (De Java a Python)

## 1. Tabla de Java-ismos (Parte 1)

| # | Java-ismo | Donde (clase.metodo) | Inversion que lo explica | Sintoma observable |
|---|---|---|---|---|
| 1 | Getters preventivos sin logica | `Figura.getNombre`, `Figura.getColor` | **Encapsulamiento por convencion**: Uso el atributo directo o `_atributo`. Solo aplico `@property` si necesito logica extra. | Codigo largo y poco idiomatico. |
| 2 | Getter/setter con validacion | `Lado.getLongitud`, `Lado.setLongitud` | **Declaracion a Runtime / @property**: Convierto el atributo en propiedad para esconder la validacion. | Llamadas del tipo `l.setLongitud(5)`. |
| 3 | Atributo estatico mutable compartido | `Poligono.catalogo = []` | **Declaracion a Runtime**: Al cargarse el modulo, creo un estado global mutable sin querer. | Modificar la lista desde una instancia la modifica para todas. |
| 4 | Argumento por defecto mutable | `Poligono.__init__(lados=[])` | **Declaracion a Runtime**: El `[]` se evalua una sola vez cuando defino la funcion. | Dos poligonos vacios comparten la misma lista en la memoria. |
| 5 | Constructor padre olvidado (reasignacion) | `Poligono.__init__` | **Acuerdo**: En Python tengo que llamar explicitamente a `super().__init__()` en lugar de repetir codigo. | Duplico logica y puedo generar estados inconsistentes. |
| 6 | Guardado de alias de lista | `Poligono.__init__` (`self._lados = lados`) | **Encapsulamiento / Copia Defensiva**: Como las listas son mutables, hago una copia (`list(lados)`) para evitar problemas. | Si el cliente vacia su lista, mi poligono se queda sin lados. |
| 7 | Bucle acumulador manual | `Poligono.perimetro` | **Acuerdo / Idiomatico**: Prefiero usar funciones nativas como `sum` o comprensiones. | Codigo largo y muy manual. |
| 8 | Sobrecarga de constructores | `Triangulo.__init__` (`*args`, `isinstance`) | **Duck typing / Runtime**: Manejo la flexibilidad con parametros por defecto `None`, no con chequeos estaticos de tipos. | Codigo espagueti en el constructor. |

### Demostracion: @property vs Getter/Setter (Parte 1, Punto 4)
Para el unico getter/setter que **si** tenia logica de validacion (`getLongitud` / `setLongitud`), aplique `@property`. Esto me permite trabajar con un atributo publico sin modificar el codigo cliente:

**Antes (como atributo publico sin logica):**
```python
lado.longitud = 5  # Codigo cliente
```
**Despues (al necesitar validacion, uso `@property` y `@longitud.setter`):**
```python
lado.longitud = 5  # El codigo cliente no cambia una sola linea
```
*(Si lo hacia estilo Java, tendria que haber cambiado todo el codigo cliente de `lado.longitud = 5` a `lado.setLongitud(5)`).*

## 2. Preguntas sobre Relaciones Estructurales (Parte 2)

**Si la sintaxis de guardar la referencia es identica en los tres casos (`self._algo = algo`), como se ve en el codigo la diferencia entre agregacion y composicion?**

La diferencia principal la veo en **quien instancia el objeto y quien controla su ciclo de vida**:
- **Composicion (`Poligono` — `Lado`)**: Yo hago que el `Poligono` fabrique o se adueñe de los lados copiandolos, no tienen sentido fuera de el. Lo veo en `self._lados = list(lados)` dentro del constructor. Si borro el poligono, los lados desaparecen.
- **Agregacion (`Taller` — `Poligono`)**: Hago que el `Taller` reciba los poligonos ya creados desde afuera (`def recibir(self, poligono)`). Si elimino el taller, sigo teniendo mis poligonos. El taller no controla la vida de los poligonos.
- **Asociacion (`Lado` — `Etiqueta`)**: Es un vinculo debil. El lado puede tener o no una etiqueta (`Optional[Etiqueta]`).

## 3. Decision sobre `PoligonoRegular` (Parte 3)

Decidi **sacar `PoligonoRegular` de la jerarquia de clases** (no hereda de `Poligono`) y reemplazarla por una funcion (factory) que llame `crear_poligono_regular`. 

**Justificacion:** Para mi, un poligono regular *es* un Triangulo, Cuadrado o Pentagono que simplemente tiene sus lados iguales. En Java habian creado esa clase solo para conformar al compilador y poder agruparlos en una lista. Como Python usa duck typing, no necesito forzar la herencia si el dominio real no me lo pide. Prefiero instanciar la subclase que corresponde desde una funcion constructora.

## 4. Lo decide el lenguaje o el dominio? (Parte 4)

Para mi eleccion entre **ABC** y **Protocol** para `Poligono`, el que manda es el **dominio**. Pero para `PlanoCAD` (la libreria externa), el que manda es el **lenguaje**.
- Use **ABC** para `Poligono` porque en este dominio quise obligar desde un principio a que todo poligono defina cuantos lados espera. Para mi, un `Triangulo` *es-un* `Poligono` y la herencia tiene sentido.
- Use **Protocol** para `Exportable` porque `PlanoCAD` es externo. Como no puedo modificarlo para que herede de mis clases, el lenguaje me obliga a usar un protocolo (duck typing estructural) para asegurar el contrato.

## 5. Tabla de Equivalencias (Cierre)

Que parte de mi modelo cambio al pasar de Java a Python y que se mantuvo identico?

| Elemento en Java | Como quedo en mi codigo Python | ¿Traduccion directa o rediseño? | Por que |
|---|---|---|---|
| Clases y objetos base | `class Poligono(Figura):` | Traduccion directa | El paradigma de objetos es el mismo, la sintaxis casi no cambia. |
| Variables private | `self._nombre = nombre` | Rediseño conceptual | Pase de un chequeo estricto del compilador a un **acuerdo** (usar `_`). |
| Getters/Setters simples | Atributo directo o property | Rediseño conceptual | Como Python tiene `@property`, no me obliga a usar metodos si no hay logica. |
| Interfaces | `class Exportable(Protocol):` | Rediseño conceptual | En vez de heredar obligadamente, uso un contrato estructural en runtime. |
| Multiples constructores | Argumentos por defecto (`None`) | Rediseño conceptual | Python no me deja sobrecargar por tipos. Lo arregle usando kwargs o factories. |
