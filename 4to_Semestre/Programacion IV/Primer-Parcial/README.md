# Parcial 1 - Programacion IV

## Descripcion del Proyecto
Este proyecto implementa en memoria el catalogo de productos para el comercio "Food Store". El sistema modela la clasificacion y venta de productos simples, productos por peso y combos promocionales, resolviendo polimorficamente los calculos de precios, el manejo de stock y la exportacion de datos hacia un sistema externo de cajas.

## Ejecucion del proyecto
Para correr la demostracion del catalogo, ejecuta:
```bash
python3 main.py
```

## Decisiones de diseño implementadas

A continuacion, dejo explicadas las decisiones de diseño tomadas para la resolucion del parcial:

### Requerimiento 2: Invariante de la clasificacion principal
Para garantizar que un producto tenga siempre exactamente una categoria principal, al clasificar con `es_principal=True`, recorro la lista interna de clasificaciones e invoco el metodo protegido `_marcar_principal(False)` sobre la clasificacion anterior. Esto me permite reordenar el estado interno mutando el vinculo existente de forma controlada desde la clase `Producto` (dueña de la composicion), sin tener que destruir y recrear objetos.

### Requerimiento 3: Herencia y `ProductoDestacado`
Decidi remover la clase `ProductoDestacado` y rediseñar el modelo. La caracteristica de estar en vidriera fue movida a la clase base `Producto` mediante el atributo opcional `_orden_vidriera`. Esto obedece a que "destacado" no representa una especializacion estricta de las reglas de calculo de venta, sino un estado. De esta forma, cualquier producto (Simple, PorPeso, Combo) puede destacarse en la vidriera sin forzar herencias innecesarias ni duplicar logica.

### Requerimiento 3: Precio base y stock en `ProductoCombo`
Dado que el diagrama dejaba abierto como se obtenian estos valores en un combo, decidi derivarlos. El `_precio_base` del combo se calcula sumando el precio final unitario de todos sus componentes. Por otro lado, su `_stock_cantidad` se determina tomando el stock minimo disponible entre sus componentes, ya que si falta aunque sea un componente, no se puede conformar el combo completo.

### Requerimiento 4: Contratos estructurales
Utilice `typing.Protocol` para definir la interfaz `Exportable`. Esto permitio lograr una conformidad puramente estructural: tanto mis clases `Producto` como la clase intocable `FichaPuntoDeVenta` cumplen con el contrato simplemente por implementar `exportar() -> str`, demostrando un acoplamiento debil sin forzar herencias sobre codigo de terceros.
