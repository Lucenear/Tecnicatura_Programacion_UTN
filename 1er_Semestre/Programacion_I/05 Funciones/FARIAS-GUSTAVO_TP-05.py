# 1. Crear una función llamada imprimir_hola_mundo que imprima por
# pantalla el mensaje: “Hola Mundo!”. Llamar a esta función desde el
# programa principal.

def imprimir_hola_mundo(mensaje):
    print(mensaje)

# Programa principal
imprimir_hola_mundo("Hola Mundo!")

# 2. Crear una función llamada saludar_usuario(nombre) que reciba
# como parámetro un nombre y devuelva un saludo personalizado.
# Por ejemplo, si se llama con saludar_usuario("Marcos"), deberá devolver: “Hola Marcos!”. Llamar a esta función desde el programa
# principal solicitando el nombre al usuario.

def saludar_usuario(nombre):
    return f'Hola {nombre}!'

# Programa principal
nombre = input('Ingresa tu nombre: ')
print(saludar_usuario(nombre))

# 3. Crear una función llamada informacion_personal(nombre, apellido,
# edad, residencia) que reciba cuatro parámetros e imprima: “Soy
# [nombre] [apellido], tengo [edad] años y vivo en [residencia]”. Pedir los datos al usuario y llamar a esta función con los valores ingresados.

def informacion_personal(nombre, apellido, edad, residencia):
    return print(f'Soy {nombre} {apellido}, tengo {edad} años  y vivo en {residencia}')

nombre = input('Ingresa tu nombre: ')
apellido = input('Ingresa tu apellido: ')
edad = input('Ingresa tu edad: ')
residencia = input('Ingresa tu lugar de residencia: ')

informacion_personal(nombre, apellido, edad, residencia)

# 4. Crear dos funciones: calcular_area_circulo(radio) que reciba el radio como parámetro y devuelva el área del círculo. 
# calcular_perimetro_circulo(radio) que reciba el radio como parámetro y devuelva el perímetro del círculo.
# Solicitar el radio al usuario y llamar ambas funciones para mostrar los resultados.

def calcular_area_circulo(radio):
    area_circulo = 3.14 * radio ** 2
    return area_circulo

def calcular_perimetro_circulo(radio):
    perimetro_circulo = 2 * 3.14 * radio
    return perimetro_circulo

radio = float(input('Ingrese el radio: '))

print(f'El area del circulo es de {calcular_area_circulo(radio):.2f} y su perimetro es de {calcular_perimetro_circulo(radio):.2f}')


# 5. Crear una función llamada segundos_a_horas(segundos) que reciba
# una cantidad de segundos como parámetro y devuelva la cantidad
# de horas correspondientes. Solicitar al usuario los segundos y mostrar el resultado usando esta función.

def segundos_a_horas(segundos):
    horas = segundos / 3600
    return horas

segundos = int(input('Ingrese la cantidad de segundos que quiera convertir: '))
print(f'{segundos} segundos equivalen a {segundos_a_horas(segundos):.2f} horas')

# 6. Crear una función llamada tabla_multiplicar(numero) que reciba un
# número como parámetro y imprima la tabla de multiplicar de ese
# número del 1 al 10. Pedir al usuario el número y llamar a la función.

def tabla_multiplicar(numero):
    for i in range(1,11):
        resultado = i * numero
        print(f'{numero} x {i} = {resultado}')

numero_usuario = int(input('Ingrese un numero: '))

tabla_multiplicar(numero_usuario)

# 7. Crear una función llamada operaciones_basicas(a, b) que reciba
# dos números como parámetros y devuelva una tupla con el resultado de sumarlos, restarlos, multiplicarlos y dividirlos. Mostrar los resultados de forma clara.

def operaciones_basicas(a,b):
    suma = a + b
    resta = a - b
    multiplicacion = a * b
    division = a / b
    return suma, resta, multiplicacion, division

num1 = float(input('Ingrese el primer numero: '))
num2 = float(input('Ingrese el segundo numero: '))

# se deseempaqueta la la tupla de cada operacion en orden
suma, resta, multi, div = operaciones_basicas(num1, num2)

print(f'Los resultados de las operaciones con los numeros {num1} y {num2} son los siguientes')
print(f'Suma: {suma}')
print(f'Resta: {resta}')
print(f'Multiplicacion: {multi}')
print(f'Division: {div}')

# 8. Crear una función llamada calcular_imc(peso, altura) que reciba el
# peso en kilogramos y la altura en metros, y devuelva el índice de
# masa corporal (IMC). Solicitar al usuario los datos y llamar a la función para mostrar el resultado con dos decimales.

def calcular_imc(peso, altura):
    imc = peso / (altura ** 2)
    return imc

peso = float(input('Ingrese su peso en kilogramos: '))
altura = float(input('Ingrese su altura en metros: '))

print(f'Su IMC (indice de masa corporal) es de {calcular_imc(peso, altura):.2f}')

# 9. Crear una función llamada celsius_a_fahrenheit(celsius) que reciba
# una temperatura en grados Celsius y devuelva su equivalente en
# Fahrenheit. Pedir al usuario la temperatura en Celsius y mostrar el
# resultado usando la función.

def celsius_a_fahrenheit(celsius):
    Fahrenheit = (celsius * 9/5) + 32
    return Fahrenheit

grados_celsius = float(input('Ingrese los grados Celcius: '))
print(f'La conversion de {grados_celsius} grados Celsius a grados Fahrenheit es de {celsius_a_fahrenheit(grados_celsius)}')

# 10.Crear una función llamada calcular_promedio(a, b, c) que reciba
# tres números como parámetros y devuelva el promedio de ellos.
# Solicitar los números al usuario y mostrar el resultado usando esta
# función.

def calcular_promedio(a, b, c):
    promedio = (a + b + c) / 3
    return promedio

num1 = float(input('Ingrese el primer numero: '))
num2 = float(input('Ingrese el segundo numero: '))
num3 = float(input('Ingrese el tercer numero: '))

print(f'El promedio de los numeros es de {calcular_promedio(num1, num2, num3)}')
