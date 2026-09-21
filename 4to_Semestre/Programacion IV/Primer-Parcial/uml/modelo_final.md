# Modelo Final - Diagrama UML

classDiagram
    class Exportable {
        <<Protocol>>
        +exportar() str
    }

    class Producto {
        <<abstract>>
        #_nombre str
        #_precio_base float
        #_stock_cantidad float
        #_habilitado bool
        #_orden_vidriera int
        #_unidad_venta UnidadMedida
        #_clasificaciones list~ProductoCategoria~
        +nombre str
        +precio_base float
        +unidad_venta UnidadMedida
        +disponible bool
        +precio_publicado str
        +precio_final(cantidad float)* float
        +habilitar() None
        +deshabilitar() None
        +clasificar_en(categoria Categoria, es_principal bool) None
        +categorias() tuple~ProductoCategoria~
        +categoria_principal() Categoria
        +exportar() str
    }

    class ProductoSimple {
        +precio_final(cantidad float) float
    }

    class ProductoPorPeso {
        +precio_final(cantidad float) float
    }

    class ProductoCombo {
        #_componentes list~Producto~
        #_descuento float
        +componentes() tuple~Producto~
        +precio_final(cantidad float) float
    }

    class Categoria {
        #_nombre str
        #_descripcion str
        +nombre str
        +descripcion str
    }

    class ProductoCategoria {
        #_categoria Categoria
        #_es_principal bool
        +categoria Categoria
        +es_principal bool
        #marcar_principal(valor bool) None
    }

    class UnidadMedida {
        <<frozen dataclass>>
        +nombre str
        +simbolo str
        +tipo str
    }

    class FichaPuntoDeVenta {
        <<libreria externa>>
        +exportar() str
    }

    Producto <|-- ProductoSimple
    Producto <|-- ProductoPorPeso
    Producto <|-- ProductoCombo
    
    Producto "1" *-- "1..*" ProductoCategoria : composicion
    ProductoCombo "1" o-- "2..*" Producto : agregacion
    Producto "0..*" --> "0..1" UnidadMedida : asociacion
    ProductoCategoria "0..*" --> "1" Categoria

    Producto ..|> Exportable : conformidad estructural
    FichaPuntoDeVenta ..|> Exportable : conformidad estructural
