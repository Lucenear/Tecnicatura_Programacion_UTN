package com.tp.jpa.repository;

import com.tp.jpa.model.Categoria;

import com.tp.jpa.model.Producto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;

public class CategoriaRepository extends BaseRepository<Categoria> {
    public CategoriaRepository() {
        super(Categoria.class);
    }

    // Consulta JPQL: retorna los productos activos de una categoria.
    // Se filtra por el id de la categoria (parametro nombrado :catId) y
    // por p.eliminado = false para excluir las bajas logicas.
    public List<Producto> buscarProductosPorCategoria(Long catId) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p FROM Producto p WHERE p.categoria.id = :catId AND p.eliminado = false";
            TypedQuery<Producto> q = em.createQuery(jpql, Producto.class);
            q.setParameter("catId", catId);
            return q.getResultList();
        } finally {
            em.close();
        }
    }
}
