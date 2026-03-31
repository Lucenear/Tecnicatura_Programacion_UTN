'''
Actividades
1) Dado el diccionario precios_frutas
precios_frutas = {'Banana': 1200, 'Ananá': 2500, 'Melón': 3000, 'Uva':
1450}
Añadir las siguientes frutas con sus respectivos precios:
● Naranja = 1200
● Manzana = 1500
● Pera = 2300
'''

precios_frutas = {
    'Banana': 1200,
    'Ananá': 2500,
    'Melón': 3000,
    'Uva': 1450
    }

precios_frutas.update({'Naranja': 1200, 'Manzana': 1500, 'Pera': 2300})

print(f"Resultados Ejercicio 1: {precios_frutas}")

'''
2) Siguiendo con el diccionario precios_frutas que resulta luego de ejecutar el código
desarrollado en el punto anterior, actualizar los precios de las siguientes frutas:
● Banana = 1330
● Manzana = 1700
● Melón = 2800
'''

precios_frutas.update({'Banana': 1330, 'Manzana': 1700, 'Melón': 2800})

print(f"Resultados Ejercicio 2: {precios_frutas}")

'''
3) Siguiendo con el diccionario precios_frutas que resulta luego de ejecutar el código
desarrollado en el punto anterior, crear una lista que contenga únicamente las frutas sin los
precios.
'''

frutas = list(precios_frutas.keys())

print(f"Resultados Ejercicio 3: {frutas}")

'''
4) Escribí un programa que permita almacenar y consultar números telefónicos.
• Permití al usuario cargar 5 contactos con su nombre como clave y número como valor.
• Luego, pedí un nombre y mostrale el número asociado, si existe.
'''

contactos = {}

for i in range(5):
    nombre = input(f'Ingresa el nombre del contacto: ')
    numero = input(f'Ingresa el numero de {nombre}: ')
    contactos[nombre] = numero

print(f"Resultados Ejercicio 4: {contactos}")

consulta_contacto = input('Ingresa el nombre del contacto a buscar: ')

if consulta_contacto in contactos:
    print(f'El numero de {consulta_contacto} es {contactos[consulta_contacto]}')
else:
    print(f'El contacto {consulta_contacto} no se encuentra registrado')

'''
5) Solicita al usuario una frase e imprime:
• Las palabras únicas (usando un set).
• Un diccionario con la cantidad de veces que aparece cada palabra.
'''

frase = input('Ingresa una frase: ')
palabras_unicas = set(frase.split())

recuento = {}

for i in frase.split():
    palabra = i
    if palabra in recuento:
        recuento[palabra] += 1 
    else:
        recuento[palabra] = 1

print(f'{palabras_unicas}')
print(f'{recuento}')

'''
6) Permití ingresar los nombres de 3 alumnos, y para cada uno una tupla de 3 notas.
Luego, mostrá el promedio de cada alumno.
'''

alumnos = {}

for i in range(3):
    nombre = input(f'Ingresa el nombre del alumno: ')
    notas = tuple(int(input(f'Ingresa la nota {j + 1} de {nombre}: ')) for j in range(3)) # agrego +1 porque el indice empieza en 0
    alumnos[nombre] = notas

print(f'Resultados Ejercicio 6: {alumnos}')

for nombre, notas in alumnos.items():
    promedio = sum(notas) / len(notas)
    print(f'El promedio de {nombre} es {promedio:.2f}')

'''
7) Dado dos sets de números, representando dos listas de estudiantes que aprobaron Parcial 1
y Parcial 2:
• Mostrá los que aprobaron ambos parciales.
• Mostrá los que aprobaron solo uno de los dos.
• Mostrá la lista total de estudiantes que aprobaron al menos un parcial (sin repetir).
'''

parcial_1 = {1, 2, 3}
parcial_2 = {3, 4, 5}

aprobados_ambos = parcial_1 & parcial_2
aprobado_solo_un_parcial = parcial_1 ^ parcial_2
aprobado_al_menos_uno = parcial_1 | parcial_2

print(f'Resultados Ejercicio 7:')
print(f'Aprobaron ambos parciales: {aprobados_ambos}')
print(f'Aprobaron solo uno de los dos: {aprobado_solo_un_parcial}')
print(f'Aprobaron al menos uno: {aprobado_al_menos_uno}')

'''
8) Armá un diccionario donde las claves sean nombres de productos y los valores su stock.
Permití al usuario:
• Consultar el stock de un producto ingresado.
• Agregar unidades al stock si el producto ya existe.
• Agregar un nuevo producto si no existe.
'''

stock_productos = {
    'manzana': 3,
    'banana': 7,
    'pera': 5
}

producto = input("Ingresa el nombre del producto: ")

if producto in stock_productos:
    print(f"Stock actual de {producto}: {stock_productos[producto]}")
    
    unidades = int(input(f"Cuantas unidades queres agregar a {producto}? "))
    stock_productos[producto] += unidades
    print(f"Nuevo stock de {producto}: {stock_productos[producto]}")
else:
    print(f"{producto} no esta en el stock")
    
    unidades = int(input(f"¿Cuantas unidades queres agregar para {producto}? "))
    stock_productos[producto] = unidades
    print(f"{producto} fue agregado con {unidades} unidades")

print("\nStock actualizado:")
for producto, cantidad in stock_productos.items():
    print(f"{producto}: {cantidad} unidades")

'''
9) Creá una agenda donde las claves sean tuplas de (día, hora) y los valores sean eventos.
Permití consultar qué actividad hay en cierto día y hora.
'''

agenda = {
    ('Lunes', '10:00'): 'Reunion de equipo',
    ('Martes', '14:00'): 'Clase de ingles',
    ('Miercoles', '16:30'): 'Consulta medica'
}


dia = input("Ingresa el dia: ")
hora = input("Ingresa la hora (formato HH:MM): ")

clave = (dia, hora)

if clave in agenda:
    print(f"Actividad para {dia} a las {hora}: {agenda[clave]}")
else:
    print(f"No hay ninguna actividad registrada para {dia} a las {hora}")

'''
10) Dado un diccionario que mapea nombres de países con sus capitales, construí un nuevo
diccionario donde:
• Las capitales sean las claves.
• Los países sean los valores.
'''

paises_capitales = {
    'Argentina': 'Buenos Aires',
    'Brasil': 'Brasilia',
    'Francia': 'Paris',
    'Alemania': 'Berlin',
    'Japon': 'Tokio'
}

capitales_paises = {}

for pais, capital in paises_capitales.items():
    capitales_paises[capital] = pais

print(f'{capitales_paises}')