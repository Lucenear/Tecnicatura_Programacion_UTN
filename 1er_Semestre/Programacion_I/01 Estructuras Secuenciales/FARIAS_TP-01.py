"""
1) Crear un programa que imprima por pantalla el mensaje: “Hola Mundo!”.
"""

print("Hola Mundo!")

"""
2) Crear un programa que pida al usuario su nombre e imprima por pantalla un saludo usando
el nombre ingresado. Por ejemplo: si el usuario ingresa “Marcos”, el programa debe imprimir
por pantalla “Hola Marcos!”. Consejo: esto será más sencillo si utilizas print(f…) para
realizar la impresión por pantalla.
"""

nombre = input("Ingrese su nombre: ")
print(f'Hola {nombre}! Te damos la bienvenida a Programacion I')


"""
3) Crear un programa que pida al usuario su nombre, apellido, edad y lugar de residencia e
imprima por pantalla una oración con los datos ingresados. Por ejemplo: si el usuario ingresa
“Marcos”, “Pérez”, “30” y “Argentina”, el programa debe imprimir “Soy Marcos Pérez, tengo 30
años y vivo en Argentina”. Consejo: esto será más sencillo si utilizas print(f…) para realizar
la impresión por pantalla."
"""
nombre = input("Ingrese su nombre: ")
apellido = input("Ingrese su apellido: ")
edad = input("Ingrese su edad: ")
lugarResidencia = input("Ingrese su lugar de residencia: ")
print(f"Soy {nombre} {apellido}, tengo {edad} años y vivo en {lugarResidencia}")

"""
4) Crear un programa que pida al usuario el radio de un círculo e imprima por pantalla su área y
su perímetro.
"""

pi = 3.14159
radio = float(input("Ingresa el radio de tu circulo: "))
area = pi * (radio ** 2)
perimetro = (2 * pi) * radio
print(f'En base al radio ingresado de {radio}, el area de tu circulo es {area} y el perimetro de {perimetro}')


"""
5) Crear un programa que pida al usuario una cantidad de segundos e imprima por pantalla a
cuántas horas equivale."
"""

segundos = int(input('Ingrese la cantidad de segundos: '))
horas = segundos / 3600
print(f"En base a la cantidad de segundos ingresados, los mismos equivalen a {horas} hora/s")


"""
6) Crear un programa que pida al usuario un número e imprima por pantalla la tabla de
multiplicar de dicho número."
"""

numero = int(input('Ingrese su numero: '))
print(f'\La tabla de multiplicar del {numero} es: ')
for i in range(1,11):
    print(f'{numero} x {i} = {numero * i}')

"""
7) Crear un programa que pida al usuario dos números enteros distintos del 0 y muestre por
pantalla el resultado de sumarlos, dividirlos, multiplicarlos y restarlos."
"""

numero1 = int(input('Ingrese el primer numero (distinto a 0): '))
numero2 = int(input('Ingrese el segundo numero (distinto a 0): '))
if numero1 !=0 and numero2 != 0:
    suma = numero1 + numero2
    resta = numero1 - numero2
    division = numero1 / numero2
    multiplicacion = numero1 * numero2
    print(f'El resultado de las siguientes operaciones son: \n La suma es {suma}\n La resta es {resta}\n La division es {division}\n La multiplicacion es {multiplicacion}')
else:
    print('No se permite seleccionar el numero 0')


"""
8) Crear un programa que pida al usuario su altura y su peso e imprima por pantalla su índice
de masa corporal. Tener en cuenta que el índice de masa corporal se calcula del siguiente
modo:
𝐼𝑀𝐶 =
𝑝𝑒𝑠𝑜 𝑒𝑛 𝑘𝑔
(𝑎𝑙𝑡𝑢𝑟𝑎 𝑒𝑛 𝑚)
2
"""

altura = float(input('Ingresa tu altura (metros): '))
peso = float(input("Ingresa tu peso (kg): "))
masaCorporal = peso / (altura ** 2)
print(f'Tu indice de masa corporal es de {masaCorporal}')


"""
9) Crear un programa que pida al usuario una temperatura en grados Celsius e imprima por
pantalla su equivalente en grados Fahrenheit. Tener en cuenta la siguiente equivalencia:
𝑇𝑒𝑚𝑝𝑒𝑟𝑎𝑡𝑢𝑟𝑎 𝑒𝑛 𝐹𝑎ℎ𝑟𝑒𝑛ℎ𝑒𝑖𝑡 =
9
5
. 𝑇𝑒𝑚𝑝𝑒𝑟𝑎𝑡𝑢𝑟𝑎 𝑒𝑛 𝐶𝑒𝑙𝑠𝑖𝑢𝑠 + 32

"""

temperaturaCelsius = float(input(f'Ingresa la temperatura en grados Celsius: '))
gradosFahrenheit = (9 / 5) * temperaturaCelsius + 32
print(f'Los {temperaturaCelsius} grados Celsius ingresados, equivalen a {gradosFahrenheit} grados Fahrenheit')

"""
10) Crear un programa que pida al usuario 3 números e imprima por pantalla el promedio de
dichos números.
"""

numero1 = float(input('Ingrese su primer numero: '))
numero2 = float(input('Ingrese el segundo numero: '))
numero3 = float(input(f'Ingrese el tercer numero: '))
promedio = (numero1 + numero2 + numero3) / 3
print(f'El promedio de tus numeros es: {promedio}')

