"""
1) Escribir un programa que solicite la edad del usuario. Si el usuario es mayor de 18 años,
deberá mostrar un mensaje en pantalla que diga “Es mayor de edad”.
"""

edadUsuario = int(input("Ingrese su edad: "))

if edadUsuario > 18:
    print("El mayor de edad")

"""
2) Escribir un programa que solicite su nota al usuario. Si la nota es mayor o igual a 6, deberá
mostrar por pantalla un mensaje que diga “Aprobado”; en caso contrario deberá mostrar el
mensaje “Desaprobado”
"""

notaUsuario = int(input('Ingrese la nota: '))

if notaUsuario >= 6:
    print('Aprobado')
else:
    print('Desaprobado')

"""
3) Escribir un programa que permita ingresar solo números pares. Si el usuario ingresa un
número par, imprimir por en pantalla el mensaje "Ha ingresado un número par"; en caso
contrario, imprimir por pantalla "Por favor, ingrese un número par". Nota: investigar el uso del
operador de módulo (%) en Python para evaluar si un número es par o impar
"""

numeroIngresado = int(input('Ingrese su numero: '))

if numeroIngresado % 2 == 0:
    print('Ha ingresado un numero par')
else:
    print('Por favor, ingrese un numero par')

"""
4) Escribir un programa que solicite al usuario su edad e imprima por pantalla a cuál de las
siguientes categorías pertenece:
● Niño/a: menor de 12 años.
● Adolescente: mayor o igual que 12 años y menor que 18 años.
● Adulto/a joven: mayor o igual que 18 años y menor que 30 años.
● Adulto/a: mayor o igual que 30 años.
"""

edad_usuario = int(input('Ingrese su edad: '))

if edad_usuario >= 0 and edad_usuario < 12:
    print('Niño/a')
elif edad_usuario >= 12 and edad_usuario < 18:
    print('Adolescente')
elif edad_usuario >= 18 and edad_usuario < 30:
    print('Adulto/a joven')
elif edad_usuario >= 30:
    print('Adulto/a')
else:
    print('Ingrese una edad valida')

"""
5) Escribir un programa que permita introducir contraseñas de entre 8 y 14 caracteres
(incluyendo 8 y 14). Si el usuario ingresa una contraseña de longitud adecuada, imprimir por en
pantalla el mensaje "Ha ingresado una contraseña correcta"; en caso contrario, imprimir por
pantalla "Por favor, ingrese una contraseña de entre 8 y 14 caracteres". Nota: investigue el uso
de la función len() en Python para evaluar la cantidad de elementos que tiene un iterable tal
como una lista o un string.
"""

contrasenaIngresada = input('Ingrese una contrasena: ')

if len(contrasenaIngresada) >= 8 and len(contrasenaIngresada) <= 14:
    print('Ha ingresado una contraseña correcta')
else:
    print('Por favor, ingrese una contraseña de entre 8 y 14 caracteres')

"""
6) El paquete statistics de python contiene funciones que permiten tomar una lista de números
y calcular la moda, la mediana y la media de dichos números. Un ejemplo de su uso es el
siguiente:
from statistics import mode, median, mean
mi_lista = [1,2,5,5,3]
mean(mi_lista)
En la documentación oficial se puede encontrar más información sobre este paquete:
https://docs.python.org/es/3.8/library/statistics.html.
La moda (mode), la mediana (median) y la media (mean) son parámetros estadísticos que se
pueden utilizar para predecir la forma de una distribución normal a partir del siguiente criterio:
● Sesgo positivo o a la derecha: cuando la media es mayor que la mediana y, a su vez, la
mediana es mayor que la moda.
● Sesgo negativo o a la izquierda: cuando la media es menor que la mediana y, a su vez,
la mediana es menor que la moda.
● Sin sesgo: cuando la media, la mediana y la moda son iguales.
Teniendo en cuenta lo antes mencionado, escribir un programa que tome la lista
numeros_aleatorios, calcule su moda, su mediana y su media y las compare para determinar si
hay sesgo positivo, negativo o no hay sesgo. Imprimir el resultado por pantalla.
Definir la lista numeros_aleatorios de la siguiente forma:
import random
numeros_aleatorios = [random.randint(1, 100) for i in range(50)]
Nota: el bloque de código anterior crea una lista con 50 números entre 1 y 100 elegidos de
forma aleatoria.
"""

from statistics import mode, median, mean
import random

numeros_aleatorios = [random.randint(1,100) for i in range(50)]
media = mean(numeros_aleatorios)
mediana = median(numeros_aleatorios)
moda = mode(numeros_aleatorios)

print(f'Para esta lista de valores: {numeros_aleatorios}\nLa media es de {media},\nLa mediana es de {mediana},\nY su moda es de {moda}')

if media > mediana and mediana > moda:
    print('Sesgo positivo o a la derecha')
elif media < mediana and mediana < moda:
    print('Sesgo negativo o a la izquierda')
elif media == mediana == moda:
    print('Sin sesgo')
else:
    print('Revisar valores para evitar inconsistencias')

"""
7) Escribir un programa que solicite una frase o palabra al usuario. Si el string ingresado
termina con vocal, añadir un signo de exclamación al final e imprimir el string resultante por
pantalla; en caso contrario, dejar el string tal cual lo ingresó el usuario e imprimirlo por
pantalla.
"""

palabra = input("Ingrese una frase o palabra: ")
vocales = ['a', 'e', 'i', 'o', 'u']

if palabra[-1] in vocales:
    print(f'{palabra}!')
else:
    print(f'{palabra}')

"""
8) Escribir un programa que solicite al usuario que ingrese su nombre y el número 1, 2 o 3
dependiendo de la opción que desee:
1. Si quiere su nombre en mayúsculas. Por ejemplo: PEDRO.
2. Si quiere su nombre en minúsculas. Por ejemplo: pedro.
3. Si quiere su nombre con la primera letra mayúscula. Por ejemplo: Pedro.
El programa debe transformar el nombre ingresado de acuerdo a la opción seleccionada por el
usuario e imprimir el resultado por pantalla. Nota: investigue uso de las funciones upper(),
lower() y title() de Python para convertir entre mayúsculas y minúsculas.
"""

nombre = input('Ingrese su nombre: ')
opcion = int(input('Ingrese una opcion:\n1. Si quiere su nombre en mayúsculas. Por ejemplo: PEDRO.\n2. Si quiere su nombre en minúsculas. Por ejemplo: pedro.\n3. Si quiere su nombre con la primera letra mayúscula. Por ejemplo: Pedro.\nOpcion: '))

if opcion == 1:
    print(f'{nombre.upper()}')
elif opcion == 2:
    print(f'{nombre.lower()}')
elif opcion == 3:
    print(f'{nombre.title()}')
else:
    print('Debe ingresar una opcion valida: 1, 2 o 3')

"""
9) Escribir un programa que pida al usuario la magnitud de un terremoto, clasifique la
magnitud en una de las siguientes categorías según la escala de Richter e imprima el resultado
por pantalla:
● Menor que 3: "Muy leve" (imperceptible).
● Mayor o igual que 3 y menor que 4: "Leve" (ligeramente perceptible).
● Mayor o igual que 4 y menor que 5: "Moderado" (sentido por personas, pero
generalmente no causa daños).
● Mayor o igual que 5 y menor que 6: "Fuerte" (puede causar daños en estructuras
débiles).
● Mayor o igual que 6 y menor que 7: "Muy Fuerte" (puede causar daños significativos).
● Mayor o igual que 7: "Extremo" (puede causar graves daños a gran escala).
"""

try:
    magnitud = float(input('Ingrese la magnitud del terremoto: '))

    if magnitud < 0:
        print('El valor de la magnitud debe ser mayor a 0') 
    elif magnitud < 3:
        print('"Muy leve" (imperceptible).')
    elif magnitud < 4:
        print('"Leve" (ligeramente perceptible).')
    elif magnitud < 5:
        print('"Moderado" (sentido por personas, pero generalmente no causa daños).')
    elif magnitud < 6:
        print('"Fuerte" (puede causar daños en estructuras débiles).')
    elif magnitud < 7:
        print('"Muy Fuerte" (puede causar daños significativos).')
    else:
        print('"Extremo" (puede causar graves daños a gran escala).')

except ValueError:
    print('Debe ingresar un numero valido')

"""
10) Utilizando la información aportada en la siguiente tabla sobre las estaciones del año
Periodo del año
Estación en el
hemisferio norte
Estación en el
hemisferio sur
Desde el 21 de diciembre hasta el 20 de
marzo (incluidos)
Invierno Verano
Desde el 21 de marzo hasta el 20 de junio
(incluidos)
Primavera Otoño
Desde el 21 de junio hasta el 20 de
septiembre (incluidos)
Verano Invierno
Desde el 21 de septiembre hasta el 20 de
diciembre (incluidos)
Otoño Primavera
Escribir un programa que pregunte al usuario en cuál hemisferio se encuentra (N/S), qué mes
del año es y qué día es. El programa deberá utilizar esa información para imprimir por pantalla
si el usuario se encuentra en otoño, invierno, primavera o verano.
"""

hemisferio = input('Ingrese su hemiferio (N = Norte, S = Sur): ').upper()
mes = input('Ingrese el mes. Ej: Enero, Febreno, Marzo, etc: ').title()
dia = int(input('Ingrese el dia. Ej: 01, 02, 03, etc: '))

if hemisferio == 'N':
    if mes == 'Diciembre' and dia >= 21 or mes in ('Enero', 'Febrero') or mes == 'Marzo' and dia <= 20:
        print('Te encontras en Invierno')
    if mes == 'Marzo' and dia >= 21 or mes in ('Abril', 'Mayo') or mes == 'Junio' and dia <= 20:
        print('Te encontras en Primavera')
    if mes == 'Junio' and dia >= 21 or mes in ('Julio', 'Agosto') or mes == 'Septiembre' and dia <= 20:
        print('Te encontras en Verano')
    if mes == 'Septiembre' and dia >= 21 or mes in ('Octubre', 'Noviembre') or mes == 'Diciembre' and dia <= 20:
        print('Te encontras en Otono')
else:
    if mes == 'Diciembre' and dia >= 21 or mes in ('Enero', 'Febrero') or mes == 'Marzo' and dia <= 20:
        print('Te encontras en Verano')
    if mes == 'Marzo' and dia >= 21 or mes in ('Abril', 'Mayo') or mes == 'Junio' and dia <= 20:
        print('Te encontras en Otono')
    if mes == 'Junio' and dia >= 21 or mes in ('Julio', 'Agosto') or mes == 'Septiembre' and dia <= 20:
        print('Te encontras en Invierno')
    if mes == 'Septiembre' and dia >= 21 or mes in ('Octubre', 'Noviembre') or mes == 'Diciembre' and dia <= 20:
        print('Te encontras en Primavera')

