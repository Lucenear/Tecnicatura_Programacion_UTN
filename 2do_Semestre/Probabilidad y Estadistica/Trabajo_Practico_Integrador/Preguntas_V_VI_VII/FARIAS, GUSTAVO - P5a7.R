# Si necesitas revisar los pdf, videos, codigo, etc., ingresa a mi repositorio:
# https://github.com/Lucenear/UTN-TUPaD-TPs/tree/main/Probabilidad%20y%20Estadistica/

# Librerias
library(readxl)
library(dplyr)
library(ggplot2)

# Datos
ruta_archivo <- "../TUPAD-2025-EST-TPI-planilla5.xlsx"
datos <- read_excel(ruta_archivo, sheet = "planilla")
etiquetas_satisfaccion <- read_excel(ruta_archivo, sheet = "nivel de satisfacción")

# Renombrar columnas de etiquetas
colnames(etiquetas_satisfaccion) <- c("codigo", "etiqueta")

# Configuracion de digitos
options(digits = 4)

# --- CONSIGNAS 1, 2, 3, 4 ---

# Variable: Tiempo semanal de estudio
tiempo_estudio <- datos$`TIEMPO SEMANAL en HS. DEDIC. EST.`

# Determinar cantidad optima de intervalos (Sturges)
cantidad_intervalos <- nclass.Sturges(tiempo_estudio)

# Definir intervalos
intervalos <- seq(
  min(tiempo_estudio, na.rm = TRUE),
  max(tiempo_estudio, na.rm = TRUE),
  length.out = cantidad_intervalos + 1
)

# Calcular frecuencias
frecuencia_absoluta <- table(cut(tiempo_estudio, breaks = intervalos, right = FALSE))
frecuencia_relativa <- round(frecuencia_absoluta / sum(frecuencia_absoluta), 4)
frecuencia_acumulada <- cumsum(frecuencia_absoluta)
frecuencia_relativa_acumulada <- round(cumsum(frecuencia_relativa), 4)

# Tabla de frecuencias - Tiempo de estudio
tabla_frecuencia_tiempo <- data.frame(
  Intervalo = names(frecuencia_absoluta),
  Frecuencia = as.numeric(frecuencia_absoluta),
  Frecuencia_Relativa = as.numeric(frecuencia_relativa),
  Frecuencia_Acumulada = as.numeric(frecuencia_acumulada),
  Frecuencia_Relativa_Acumulada = as.numeric(frecuencia_relativa_acumulada)
)

cat("---> Tabla de Frecuencia - Tienpo de estudio semanal\n")
print(tabla_frecuencia_tiempo)

# Variable: Satisfaccion con la carrera
datos$`SATISFACCIÓN CON LA CARRERA` <- factor(
  datos$`SATISFACCIÓN CON LA CARRERA`,
  levels = etiquetas_satisfaccion$codigo,
  labels = etiquetas_satisfaccion$etiqueta
)

# Tabla de frecuencias - Satisfaccion
tabla_satisfaccion <- datos %>%
  group_by(`SATISFACCIÓN CON LA CARRERA`) %>%
  summarise(Frecuencia = n()) %>%
  mutate(
    Frecuencia_Relativa = round(Frecuencia / sum(Frecuencia), 4),
    Frecuencia_Acumulada = cumsum(Frecuencia),
    Frecuencia_Relativa_Acumulada = round(cumsum(Frecuencia_Relativa), 4)
  )

cat("\n---> Tabla de Frecuencia - Satisfaccion con la carrera\n")
print(tabla_satisfaccion)

# ---> Medidas descriptivas - Tiempo de estudio ---
media_tiempo <- mean(tiempo_estudio, na.rm = TRUE)
mediana_tiempo <- median(tiempo_estudio, na.rm = TRUE)
moda_tiempo <- as.numeric(names(sort(table(tiempo_estudio), decreasing = TRUE))[1])

cuartiles_tiempo <- quantile(tiempo_estudio, probs = c(0.25, 0.50, 0.75), na.rm = TRUE)
q1_tiempo <- cuartiles_tiempo[1]
q2_tiempo <- cuartiles_tiempo[2]
q3_tiempo <- cuartiles_tiempo[3]

desvio_tiempo <- sd(tiempo_estudio, na.rm = TRUE)
varianza_tiempo <- var(tiempo_estudio, na.rm = TRUE)
rango_tiempo <- max(tiempo_estudio, na.rm = TRUE) - min(tiempo_estudio, na.rm = TRUE)
cv_tiempo <- (desvio_tiempo / media_tiempo) * 100

cat("\n---> Medidas descriptivas - Tiempo de estudio\n")
cat("Media:", round(media_tiempo, 2), "horas\n")
cat("Mediana:", round(mediana_tiempo, 2), "horas\n")
cat("Moda:", moda_tiempo, "horas\n")
cat("Cuartil 1 (Q1):", round(q1_tiempo, 2), "horas\n")
cat("Cuartil 2 (Mediana):", round(q2_tiempo, 2), "horas\n")
cat("Cuartil 3 (Q3):", round(q3_tiempo, 2), "horas\n")
cat("Desviacion estandar:", round(desvio_tiempo, 2), "horas\n")
cat("Varianza:", round(varianza_tiempo, 2), "horas^2\n")
cat("Rango:", round(rango_tiempo, 2), "horas\n")
cat("Coeficiente de variacion:", round(cv_tiempo, 2), "%\n")

# ---> Medidas descriptivas - Satisfaccion ---
satisfaccion_ordenada <- factor(datos$`SATISFACCIÓN CON LA CARRERA`,
                                levels = c("Muy insatisfecho", "Insatisfecho", "Satisfecho", "Muy satisfecho"),
                                ordered = TRUE)

valores_numericos <- as.numeric(satisfaccion_ordenada)
moda_satisfaccion <- names(sort(table(satisfaccion_ordenada), decreasing = TRUE))[1]
mediana_satisfaccion <- levels(satisfaccion_ordenada)[round(median(valores_numericos))]
q1_satisfaccion <- levels(satisfaccion_ordenada)[round(quantile(valores_numericos, 0.25, na.rm = TRUE))]
q3_satisfaccion <- levels(satisfaccion_ordenada)[round(quantile(valores_numericos, 0.75, na.rm = TRUE))]

cat("\n---> Medidas descriptivas - Satisfaccion\n")
cat("Moda:", moda_satisfaccion, "\n")
cat("Mediana:", mediana_satisfaccion, "\n")
cat("Cuartil 1 (Q1):", q1_satisfaccion, "\n")
cat("Cuartil 3 (Q3):", q3_satisfaccion, "\n")

# --- GRAFICOS ---
# Histograma - Tiempo de estudio
ggplot(data.frame(tiempo_estudio), aes(x = tiempo_estudio)) +
  geom_histogram(bins = cantidad_intervalos, fill = "steelblue", color = "black", alpha = 0.8) +
  labs(title = "Distribucion del tiempo semanal dedicado al estudio",
       x = "Horas semanales de estudio",
       y = "Frecuencia Absoluta") +
  theme_minimal()

# Grafico circular - Satisfaccion
satisfaccion_grafico <- tabla_satisfaccion %>%
  rename(Categoria = `SATISFACCIÓN CON LA CARRERA`) %>%
  mutate(Porcentaje = Frecuencia_Relativa * 100)

ggplot(satisfaccion_grafico, aes(x = "", y = Frecuencia, fill = Categoria)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar("y", start = 0) +
  labs(title = "Nivel de satisfaccion con la carrera") +
  theme_void() +
  scale_fill_manual(values = c("Muy insatisfecho" = "lightcoral",
                               "Insatisfecho" = "orange",
                               "Satisfecho" = "lightblue",
                               "Muy satisfecho" = "lightgreen")) +
  geom_text(aes(label = paste(round(Porcentaje, 1), "%")),
            position = position_stack(vjust = 0.5))

# --- Consigna 5: Distribucion binomial ---
cat("\n---> Consigna 5: Distribucion Binomial\n")

# Probabilidades poblacionales (basadas en frecuencias)
total_estudiantes <- nrow(datos)
frec_satisfaccion <- table(datos$`SATISFACCIÓN CON LA CARRERA`)

p_muy_satisfecho   <- frec_satisfaccion["Muy satisfecho"] / total_estudiantes
p_satisfecho       <- frec_satisfaccion["Satisfecho"] / total_estudiantes
p_insatisfecho     <- frec_satisfaccion["Insatisfecho"] / total_estudiantes
p_muy_insatisfecho <- frec_satisfaccion["Muy insatisfecho"] / total_estudiantes

n <- 16  # muestra de estudiantes

# 5a. Mas de 9 muy satisfechos
prob_5a <- 1 - pbinom(9, n, p_muy_satisfecho)
cat("5a. P(X > 9) =", round(prob_5a, 4), "\n")

# 5b. Entre 4 y 8 satisfechos
prob_5b <- pbinom(8, n, p_satisfecho) - pbinom(3, n, p_satisfecho)
cat("5b. P(4 <= Y <= 8) =", round(prob_5b, 4), "\n")

# 5c. Menos de 5 insatisfechos
prob_5c <- pbinom(4, n, p_insatisfecho)
cat("5c. P(Z < 5) =", round(prob_5c, 4), "\n")

# 5d. Exactamente 10 muy insatisfechos
prob_5d <- dbinom(10, n, p_muy_insatisfecho)
cat("5d. P(W = 10) =", round(prob_5d, 4), "\n")

# --- Consigna 6: Distribucion de Poisson ---
cat("\n---> Consigna 6: Distribucion de Poisson\n")

lambda_30min <- 15  # promedio cada 30 minutos

# 6a. Al menos 6 consultas en 20 minutos
lambda_20 <- lambda_30min * (20/30)  # 10
prob_6a <- 1 - ppois(5, lambda_20)
cat("6a. P(X >= 6 en 20 min) =", round(prob_6a, 4), "\n")

# 6b. A lo sumo 12 consultas en 40 minutos
lambda_40 <- lambda_30min * (40/30)  # 20
prob_6b <- ppois(12, lambda_40)
cat("6b. P(X <= 12 en 40 min) =", round(prob_6b, 4), "\n")

# 6c. Mas de 7 y menos de 10 en 30 minutos -> P(X=8) + P(X=9)
prob_6c <- dpois(8, lambda_30min) + dpois(9, lambda_30min)
cat("6c. P(8 o 9 en 30 min) =", round(prob_6c, 4), "\n")

# --- Consigna 7: Modelo normal (Estatura) ---
cat("\n---> Consigna 7: Modelo Normal (Estatura)\n")

estatura <- datos$`ESTATURA CM.`
mu <- mean(estatura, na.rm = TRUE)
sigma <- sd(estatura, na.rm = TRUE)

# 7a. Estatura >= 179 cm
prob_7a <- 1 - pnorm(179, mu, sigma)
cat("7a. P(X >= 179 cm) =", round(prob_7a, 4), "\n")

# 7b. Entre 147 y 172 cm
prob_7b <- pnorm(172, mu, sigma) - pnorm(147, mu, sigma)
cat("7b. P(147 < X < 172) =", round(prob_7b, 4), "\n")

# 7c. Valor que excede al 97.5%
valor_7c <- qnorm(0.975, mu, sigma) # CORREGIDO: habia puesto 0.025
cat("7c. Valor que excede al 97.5% =", round(valor_7c, 1), "cm\n")

# Parametros usados
cat("\n---> PARAMETROS USADOS EN MODELO NORMAL ---\n")
cat("Media de estatura:", round(mu, 1), "cm\n")
cat("Desvio estandar:", round(sigma, 1), "cm\n")