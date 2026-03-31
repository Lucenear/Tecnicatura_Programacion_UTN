# 1) Crea un programa que imprima en pantalla todos los números enteros desde 0 hasta 100 
# (incluyendo ambos extremos), en orden creciente, mostrando un número por línea. 

for i in range(-1,100):
    numero = i+1
    print(f'{numero}')

# 2) Desarrolla un programa que solicite al usuario un número entero y determine la cantidad de 
# dígitos que contiene.

while True:
    entrada = input('Ingrese su numero entero o presione la letra C para salir: ')
    if entrada.lower() == 'c':
        break
    else:
        numero = int(entrada)
        convNumero = len(str(numero))
        print(convNumero)


# 3) Escribe un programa que sume todos los números enteros comprendidos entre dos valores 
# dados por el usuario, excluyendo esos dos valores. 

numero1 = int(input('Ingrese el primer numero: '))
numero2 = int(input('Ingrese el segungo numero: '))
resultado = 0

for i in range(numero1+1, numero2):
    resultado += i
print(f'El resultado es: {resultado}')

# 4) Elabora un programa que permita al usuario ingresar números enteros y los sume en 
# secuencia. El programa debe detenerse y mostrar el total acumulado cuando el usuario ingrese 
# un 0.

resultado = 0

while True:
    numero = int(input('Ingrese su numero: '))
    if numero == 0:
        break
    resultado += numero
print(resultado)

# 5) Crea un juego en el que el usuario deba adivinar un número aleatorio entre 0 y 9. Al final, el 
# programa debe mostrar cuántos intentos fueron necesarios para acertar el número.

import random

numAleatorio = random.randint(0,9)
intentos = 1

while True:
    numero = int(input('Adivine el numero: '))
    if numero == numAleatorio:
        print(f'La cantidad de intentos fueron {intentos}')
        break
    else:
        intentos += 1

# 6) Desarrolla un programa que imprima en pantalla todos los números pares comprendidos 
# entre 0 y 100, en orden decreciente.

for i in range(100,0,-2):
    print(i)

# 7) Crea un programa que calcule la suma de todos los números comprendidos entre 0 y un 
# número entero positivo indicado por el usuario.

numero = int(input('Ingrese su numero: '))
resultado = 0

for i in range(0, numero):
    resultado += i
print(resultado)

# 8) Escribe un programa que permita al usuario ingresar 100 números enteros. Luego, el 
# programa debe indicar cuántos de estos números son pares, cuántos son impares, cuántos son 
# negativos y cuántos son positivos. (Nota: para probar el programa puedes usar una cantidad 
# menor, pero debe estar preparado para procesar 100 números con un solo cambio).


cantidadNumeros = 2
pares = 0
impares = 0
negativos = 0
positivos = 0

for i in range(cantidadNumeros):
    numero = int(input('Ingrese su numero: '))
    if numero % 2:
        impares += 1
    else:
        pares += 1
    if numero > 0:
        positivos += 1
    elif numero < 0:
        negativos += 1

print(f'Pares: {pares}')
print(f'Impares: {impares}')
print(f'Negativos: {negativos}')
print(f'Positivos: {positivos}')

# 9) Elabora un programa que permita al usuario ingresar 100 números enteros y luego calcule la 
# media de esos valores. (Nota: puedes probar el programa con una cantidad menor, pero debe 
# poder procesar 100 números cambiando solo un valor).

cantidadNumeros = 2
totalizador = 0

for i in range(cantidadNumeros):
    numero = int(input('Ingrese un numero: '))
    totalizador += numero

media = totalizador / cantidadNumeros
print(media)

# 10) Escribe un programa que invierta el orden de los dígitos de un número ingresado por el 
# usuario. Ejemplo: si el usuario ingresa 547, el programa debe mostrar 745.

while True:
    entrada = input('Ingrese su numero o presione la letra C para salir: ')
    if entrada.lower() == 'c':
        break
    else:
        numero = int(entrada)
        numeroInv = str(numero)[::-1]
    print(f'El numero inverso es {numeroInv}')