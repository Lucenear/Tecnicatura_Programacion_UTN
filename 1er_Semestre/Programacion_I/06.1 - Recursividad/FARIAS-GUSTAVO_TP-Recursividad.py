'''
1) Crea una función recursiva que calcule el factorial de un número. Luego, utiliza esa
función para calcular y mostrar en pantalla el factorial de todos los números enteros
entre 1 y el número que indique el usuario
'''

#solicito un numero al usuario
numero = int(input("Ingrese un numero para calcular el factorial: "))

# defino la funcion recursiva para calcular el factorial
def factorial(numero):
    if numero == 0 or numero == 1: #filtro que no sea 0 o 1
        return 1
    else:
        return numero * factorial(numero - 1) #realizo el calculo recursivo
print(f"El factorial de {numero} es: {factorial(numero)}")

#defino la funcion iterativa
def factorial_iterativo(numero):
    for i in range(1,numero+1): #aplico un ciclo y rango en el for
        resultado = factorial(i) #guardo el resultado
        print(f"El factorial de {i} es: {resultado}")#imprimo el resultado
# llamo a la funcion iterativa
factorial_iterativo(numero)

'''
2) Crea una función recursiva que calcule el valor de la serie de Fibonacci en la posición
indicada. Posteriormente, muestra la serie completa hasta la posición que el usuario
especifique
'''

#solicito un numero al usuario
numero = int(input("Ingrese un numero para calcular el valor de Fibonacci: "))

def fibonacci(numero):
    if numero <= 0:
        return 0
    elif numero == 1:
        return 1
    else:
        return fibonacci(numero - 1) + fibonacci(numero - 2)

print(f"El numero de Fibonacci en la posicion {numero} es: {fibonacci(numero)}")

def fibonacci_iterativo(numero):
    for i in range(1, numero+1):
        resultado = fibonacci(i)
        print(f"El numero de Fibonacci en la posicion {i} es: {resultado}")
#llamo a la funcion iterativa de fibonacci
fibonacci_iterativo(numero)

'''
3) Crea una función recursiva que calcule la potencia de un número base elevado a un
exponente, utilizando la fórmula 𝑛
𝑚 = 𝑛 ∗ 𝑛
(𝑚−1)
. Prueba esta función en un
algoritmo general.
'''

#solicito un numero al usuario
base = int(input("Ingrese el numero base: "))
exponente = int(input("Ingrese el exponente: "))

def potencia_base(base, exponente):
    if exponente == 0:
        return 1
    else:
        resultado = base * potencia_base(base, exponente-1)
        return resultado
resultado = potencia_base(base, exponente)
print(f"La potencia de {base} elevado a {exponente} es: {resultado}")

'''
4) Crear una función recursiva en Python que reciba un número entero positivo en base
decimal y devuelva su representación en binario como una cadena de texto.
'''

#solicito un numero al usuario
numero = int(input("Ingrese el numero: "))

def binario(numero):
    if numero == 0:
        return "0"
    elif numero == 1:
        return "1"
    else:
        resto = numero % 2
        cociente = numero // 2
        return binario(cociente) + str(resto)
print(f"El numero {numero} en binario es: {binario(numero)}")


'''
5) Implementá una función recursiva llamada es_palindromo(palabra) que reciba una
cadena de texto sin espacios ni tildes, y devuelva True si es un palíndromo o False si no
lo es.
 Requisitos:
La solución debe ser recursiva.
No se debe usar [::-1] ni la función reversed().'''

#solicito una palabra al usuario
palindromo = input("Ingrese la palabra: ")

def es_palindromo(palabra):
    if len(palabra) <= 1:
        return True
    elif palabra [0] != palabra[-1]:
        return False
    else:
        return es_palindromo(palabra[1:-1])
print(f"¿La palabra '{palindromo}' es un palíndromo? {es_palindromo(palindromo)}")


'''
7) Un niño está construyendo una pirámide con bloques. En el nivel más bajo coloca n
bloques, en el siguiente nivel uno menos (n - 1), y así sucesivamente hasta llegar al
último nivel con un solo bloque.
Escribí una función recursiva contar_bloques(n) que reciba el número de bloques en el
nivel más bajo y devuelva el total de bloques que necesita para construir toda la
pirámide.
 Ejemplos:
contar_bloques(1) → 1 (1)
contar_bloques(2) → 3 (2 + 1)
contar_bloques(4) → 10 (4 + 3 + 2 + 1)
'''
#solicito un numero al usuario
numero = int(input("Ingrese un numero: "))

def contar_bloques(numero):
    if numero == 0:
        return 0
    else:
        return numero + contar_bloques(numero - 1)
bloques = contar_bloques(numero)
print(f"El numero de bloques en la torre de {numero} es: {bloques}")


'''
8) Escribí una función recursiva llamada contar_digito(numero, digito) que reciba un
número entero positivo (numero) y un dígito (entre 0 y 9), y devuelva cuántas veces
aparece ese dígito dentro del número
'''
#solicito un numero y un digito al usuario
numero = int(input("Ingrese un numero: "))
digito = int(input("Ingrese un digito: "))

def contar_digito(numero, digito):
    if numero == 0:
        return 0
    else:
        ultimo = numero % 10
        coincidencia = 1 if ultimo == digito else 0
        return coincidencia + contar_digito(numero // 10, digito)
    
repite = contar_digito(numero, digito)
print(f"El digito {digito} aparece {repite} veces en el numero {numero}")