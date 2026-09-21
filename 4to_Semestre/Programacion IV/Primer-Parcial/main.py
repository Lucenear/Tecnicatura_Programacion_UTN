from catalogo import (
    UnidadMedida, Categoria, ProductoSimple, ProductoPorPeso,
    ProductoCombo, exportar_catalogo, DominioError, Producto
)
from libreria_externa import FichaPuntoDeVenta

def main():
    print("Iniciando demo...")
    # Creo categorias
    cat_bebidas = Categoria("Bebidas", "Para tomar")
    cat_fiambreria = Categoria("Fiambreria")
    cat_combos = Categoria("Combos Especiales")
    
    # Creo unidades
    un_kg = UnidadMedida("Kilogramo", "kg", "masa")
    un_litro = UnidadMedida("Litro", "L", "volumen")
    un_pack = UnidadMedida("Pack", "u", "unidad")

    # Productos que seran componentes del combo
    queso = ProductoPorPeso("Queso Tybo", 8000.0, 10.5, un_kg, cat_fiambreria)
    jamon = ProductoPorPeso("Jamon Cocido", 12000.0, 5.0, un_kg, cat_fiambreria)
    pan = ProductoSimple("Pan Lactal", 2500.0, 20.0, un_pack, cat_fiambreria)
    
    # Creo producto combo agrupando los anteriores
    combo_fiambre = ProductoCombo(
        "Combo Fiambreria", 
        0.10, # Aplico 10% de descuento
        [queso, jamon, pan], 
        cat_combos, 
        orden_vidriera=1 # Destaco este producto
    )

    # 4 Productos extra, ajenos al combo
    agua = ProductoSimple("Agua Mineral", 1500.0, 50.0, un_litro, cat_bebidas)
    gaseosa = ProductoSimple("Gaseosa Cola", 2000.0, 40.0, un_litro, cat_bebidas)
    tomate = ProductoPorPeso("Tomate Perita", 3000.0, 15.0, un_kg, cat_fiambreria)
    cerveza = ProductoSimple("Cerveza Lata", 1800.0, 100.0, un_pack, cat_bebidas)

    catalogo = [queso, jamon, pan, combo_fiambre, agua, gaseosa, tomate, cerveza]

    print("\n--- Catalogo ---")
    for prod in catalogo:
        print(f"{prod.nombre} - Precio publicado: {prod.precio_publicado} - Disponible: {prod.disponible}")
        
    print("\n--- Calculo de precios finales ---")
    print(f"3 Aguas: ${agua.precio_final(3):.2f}")
    print(f"0.250 kg de Queso: ${queso.precio_final(0.250):.2f}")
    print(f"2 Combos Fiambre: ${combo_fiambre.precio_final(2):.2f}")

    # Demuestro falla temprana
    print("\n--- Demostrar falla temprana ---")
    try:
        class ProductoIncompleto(Producto):
            pass
        # Debe fallar con TypeError al instanciar
        p_falla = ProductoIncompleto("Falla", 100.0, 10.0, None, cat_bebidas)
    except TypeError as e:
        print(f"Falla atrapada correctamente al instanciar Producto incompleto: {e}")

    # Exporto catalogo
    print("\n--- Exportando catalogo al punto de venta ---")
    ficha1 = FichaPuntoDeVenta("SYS01", "Caja 1")
    elementos_a_exportar = catalogo + [ficha1]
    
    lineas_exportadas = exportar_catalogo(elementos_a_exportar)
    for linea in lineas_exportadas:
        print(linea)

    print("\n--- Efecto de habilitar/deshabilitar ---")
    print(f"Agua disponible antes: {agua.disponible}")
    agua.deshabilitar()
    print(f"Agua disponible despues: {agua.disponible}")

if __name__ == "__main__":
    main()
