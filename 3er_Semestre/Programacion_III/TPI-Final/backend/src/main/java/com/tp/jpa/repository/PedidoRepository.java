package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.Estado;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {
    public PedidoRepository() {
        super(Pedido.class);
    }

    // Consulta JPQL: retorna todos los pedidos activos con un estado especifico
    // Util para filtrar PENDIENTE, CONFIRMADO, TERMINADO o CANCELADO
    public List<Pedido> buscarPorEstado(Estado estado) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            TypedQuery<Pedido> q = em.createQuery(jpql, Pedido.class);
            q.setParameter("estado", estado);
            return q.getResultList();
        } finally {
            em.close();
        }
    }
}
