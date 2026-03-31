SELECT departamento, SUM(duracion) AS total_duracion
FROM carreras
GROUP BY departamento;