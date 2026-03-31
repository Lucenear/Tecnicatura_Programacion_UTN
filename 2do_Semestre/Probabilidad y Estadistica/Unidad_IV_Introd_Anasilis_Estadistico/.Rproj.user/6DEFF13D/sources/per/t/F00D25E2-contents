library(readxl)
library(dplyr)

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
