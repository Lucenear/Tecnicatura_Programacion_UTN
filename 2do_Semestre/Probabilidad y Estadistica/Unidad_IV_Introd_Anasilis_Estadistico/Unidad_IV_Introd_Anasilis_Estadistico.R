### EJERCICIO 1 ###
# Cargo los datos
horas <- c(10, 12, 8, 14, 6, 16, 9, 13)
incidencias <- c(6, 8, 4, 9, 3, 10, 5, 8)

# Diagrama de dispersion
plot(horas, incidencias,
     main = "Relacion entre horas de capacitacion e incidencias resueltas",
     xlab = "Horas de capacitacion",
     ylab = "Incidencias resueltas",
     pch = 19,
     col = "steelblue")


### EJERCICIO 2 ###
# Calculo correlacion de Pearson
r <- cor(horas, incidencias, method = "pearson")
r

### EJERCICIO 3 ###
# Ajusto modelo de regresion lineal
modelo <- lm(incidencias ~ horas)

# Muestro resumen
summary(modelo)

# Extraigo coeficientes
coef(modelo)


### EJERCICIO 4 ###
#Prediccion con 11 hocas de capacitacion
predict(modelo, newdata = data.frame(horas = 11))


