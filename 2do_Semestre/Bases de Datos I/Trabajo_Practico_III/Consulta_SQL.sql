SELECT 
    venta.id_venta,
    vendedor.nombre AS vendedor_nombre,
    vendedor.apellido AS vendedor_apellido,
    cliente.nombre AS cliente_nombre,
    cliente.apellido AS cliente_apellido,
    producto.nombre AS producto,
    detalle_venta.cantidad,
    producto.precio,
    (detalle_venta.cantidad * producto.precio) AS subtotal
FROM venta
	JOIN vendedor
		ON venta.id_vendedor = vendedor.id_vendedor
	JOIN cliente
		ON venta.id_cliente = cliente.id_cliente
	JOIN detalle_venta
		ON venta.id_venta = detalle_venta.id_venta
	JOIN producto
		ON detalle_venta.id_producto = producto.id_producto
ORDER BY venta.id_venta
;