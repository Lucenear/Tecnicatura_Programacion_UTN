SELECT departamento, COUNT(*) AS cantidad_carreras
FROM carreras
GROUP BY departamento;