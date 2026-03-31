
# Si necesitas revisar los pdf, videos, codigo, etc., ingresa a mi repositorio:
# https://github.com/Lucenear/UTN-TUPaD-TPs/tree/main/Probabilidad%20y%20Estadistica/

library(readxl)
library(dplyr)
library(ggplot2)

ruta_archivo <- "../TUPAD-2025-EST-TPI-planilla5.xlsx"
datos <- read_excel(ruta_archivo, sheet = "planilla")
etiquetas_satisfaccion <- read_excel(ruta_archivo, sheet = "nivel de satisfacción")

colnames(etiquetas_satisfaccion) <- c("codigo", "etiqueta")

options(digits = 4)

tiempo_estudio <- datos$`TIEMPO SEMANAL en HS. DEDIC. EST.`

cantidad_intervalos <- nclass.Sturges(tiempo_estudio)

intervalos <- seq(min(tiempo_estudio, na.rm = TRUE),
                  max(tiempo_estudio, na.rm = TRUE),
                  length.out = cantidad_intervalos + 1)

frecuencia_absoluta <- table(cut(tiempo_estudio, breaks = intervalos, right = FALSE))
frecuencia_relativa <- round(frecuencia_absoluta / sum(frecuencia_absoluta), 4)
frecuencia_acumulada <- cumsum(frecuencia_absoluta)
frecuencia_relativa_acumulada <- round(cumsum(frecuencia_relativa), 4)

tabla_frecuencia_tiempo <- data.frame(
  Intervalo = names(frecuencia_absoluta),
  Frecuencia = as.numeric(frecuencia_absoluta),
  Frecuencia_Relativa = as.numeric(frecuencia_relativa),
  Frecuencia_Acumulada = as.numeric(frecuencia_acumulada),
  Frecuencia_Relativa_Acumulada = as.numeric(frecuencia_relativa_acumulada)
)

cat("Tabla de Frecuencia - Tiempo de estudio semanal:\n")
print(tabla_frecuencia_tiempo)

datos$`SATISFACCIÓN CON LA CARRERA` <- factor(
  datos$`SATISFACCIÓN CON LA CARRERA`,
  levels = etiquetas_satisfaccion$codigo,
  labels = etiquetas_satisfaccion$etiqueta
)

tabla_satisfaccion <- datos %>%
  group_by(`SATISFACCIÓN CON LA CARRERA`) %>%
  summarise(Frecuencia = n()) %>%
  mutate(
    Frecuencia_Relativa = round(Frecuencia / sum(Frecuencia), 4),
    Frecuencia_Acumulada = cumsum(Frecuencia),
    Frecuencia_Relativa_Acumulada = round(cumsum(Frecuencia_Relativa), 4)
  )

cat("\nTabla de Frecuencia - Nivel de satisfacción con la carrera:\n")
print(tabla_satisfaccion)

### Medidas descriptivas

# Tendencia central
media_tiempo <- mean(tiempo_estudio, na.rm = TRUE)
mediana_tiempo <- median(tiempo_estudio, na.rm = TRUE)
moda_tiempo <- as.numeric(names(sort(table(tiempo_estudio), decreasing = TRUE))[1])

# Cuartiles
cuartiles_tiempo <- quantile(tiempo_estudio, probs = c(0.25, 0.50, 0.75), na.rm = TRUE)
q1_tiempo <- cuartiles_tiempo[1]
q2_tiempo <- cuartiles_tiempo[2]
q3_tiempo <- cuartiles_tiempo[3]

# Dispersion
desvio_tiempo <- sd(tiempo_estudio, na.rm = TRUE)
varianza_tiempo <- var(tiempo_estudio, na.rm = TRUE)
rango_tiempo <- max(tiempo_estudio, na.rm = TRUE) - min(tiempo_estudio, na.rm = TRUE)
cv_tiempo <- (desvio_tiempo / media_tiempo) * 100


cat("\n Medidas descriptivas - Tiempo semanal de estudio\n")
cat("Media:", round(media_tiempo, 2), "horas\n")
cat("Mediana:", round(mediana_tiempo, 2), "horas\n")
cat("Moda:", moda_tiempo, "horas\n")
cat("Cuartil 1 (Q1):", round(q1_tiempo, 2), "horas\n")
cat("Cuartil 2 (Mediana):", round(q2_tiempo, 2), "horas\n")
cat("Cuartil 3 (Q3):", round(q3_tiempo, 2), "horas\n")
cat("Desviacion estandar:", round(desvio_tiempo, 2), "horas\n")
cat("Varianza:", round(varianza_tiempo, 2), "horas²\n")
cat("Rango:", round(rango_tiempo, 2), "horas\n")
cat("Coeficiente de variacion:", round(cv_tiempo, 2), "%\n")


### Satisfaccion

satisfaccion_ordenada <- factor(datos$`SATISFACCIÓN CON LA CARRERA`,
                                levels = c("Muy insatisfecho", "Insatisfecho", "Satisfecho", "Muy satisfecho"),
                                ordered = TRUE)

# Moda
moda_satisfaccion <- names(sort(table(satisfaccion_ordenada), decreasing = TRUE))[1]

# Mediana
valores_numericos <- as.numeric(satisfaccion_ordenada)
mediana_satisfaccion <- levels(satisfaccion_ordenada)[round(median(valores_numericos))]

# Cuartiles
q1_satisfaccion <- levels(satisfaccion_ordenada)[round(quantile(valores_numericos, 0.25, na.rm = TRUE))]
q3_satisfaccion <- levels(satisfaccion_ordenada)[round(quantile(valores_numericos, 0.75, na.rm = TRUE))]


cat("\nMedidas descriptivas - Satisfaccion con la carrera\n")
cat("Moda:", moda_satisfaccion, "\n")
cat("Mediana:", mediana_satisfaccion, "\n")
cat("Cuartil 1 (Q1):", q1_satisfaccion, "\n")
cat("Cuartil 3 (Q3):", q3_satisfaccion, "\n")


### Graficos

# Histograma - Tiempo de estudio (Frecuencia Absoluta)

ggplot(data.frame(tiempo_estudio), aes(x = tiempo_estudio)) +
  geom_histogram(bins = cantidad_intervalos , fill = "steelblue", color = "black", alpha = 0.8) +
  labs(title = "Distribucion del tiempo semanal dedicado al estudio",
       x = "Horas semanales de estudio",
       y = "Frecuencia Absoluta") +
  theme_minimal()


# Diagrama circular - Satisfaccion con la carrera

# Datos para grafico circular
satisfaccion_grafico <- tabla_satisfaccion %>%
  rename(Categoria = `SATISFACCIÓN CON LA CARRERA`) %>%
  mutate(Porcentaje = Frecuencia_Relativa * 100)

# Grafico de nivel de satisfaccion con la carrera
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
