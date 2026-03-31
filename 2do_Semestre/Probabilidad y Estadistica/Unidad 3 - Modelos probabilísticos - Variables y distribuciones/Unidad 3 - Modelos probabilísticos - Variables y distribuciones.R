# CASO 1

# Probabilidad de que 6 personas respondan
prob_exactamente_6 <- dbinom(6, size = 15, prob = 0.25)
prob_exactamente_6

# Probabilidad dee que como maximo 4 personas respondan
pbinom(4, size = 15, prob = 0.25)


# Caso 2

#  2 de los 5 clientes emiten respuesta

# dhyper(x, m, n, k)
# x = numero de exitos en la muestra (k = 2)
# m = numero de exitos en la poblacion (K = 7)
# n = numero de fracasos en la poblacion (N - K = 8)
# k = tamaño de la muestra (5)

dhyper(2, m = 7, n = 8, k = 5)


# Caso 3

# Probabilidad de recibir menos de 5 solicitudes en 30 minutos
# P(X <= 4) con lambda = 8

ppois(4, lambda = 8)



