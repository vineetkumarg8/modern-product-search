package com.productapi.repository;

import com.productapi.entity.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for search operations using JPA queries.
 * Note: This is a simplified version without Hibernate Search for compatibility.
 */
@Repository
public class ProductSearchRepository {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Search products by text in title and description fields using JPA queries.
     *
     * @param searchText the text to search for
     * @param pageable pagination information
     * @return Page of products matching the search criteria
     */
    public Page<Product> searchProducts(String searchText, Pageable pageable) {
        String jpql = "SELECT p FROM Product p WHERE " +
                     "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%')) " +
                     "ORDER BY p.title ASC";

        TypedQuery<Product> query = entityManager.createQuery(jpql, Product.class);
        query.setParameter("searchText", searchText);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Product> products = query.getResultList();

        // Count total results
        String countJpql = "SELECT COUNT(p) FROM Product p WHERE " +
                          "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                          "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%'))";

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        countQuery.setParameter("searchText", searchText);
        long totalHits = countQuery.getSingleResult();

        return new PageImpl<>(products, pageable, totalHits);
    }

    /**
     * Search products by text with fuzzy matching (using wildcard patterns).
     *
     * @param searchText the text to search for
     * @param pageable pagination information
     * @return Page of products matching the search criteria with fuzzy matching
     */
    public Page<Product> searchProductsFuzzy(String searchText, Pageable pageable) {
        // For fuzzy search, we'll use wildcard patterns to simulate fuzzy matching
        String jpql = "SELECT p FROM Product p WHERE " +
                     "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%')) " +
                     "ORDER BY p.title ASC";

        TypedQuery<Product> query = entityManager.createQuery(jpql, Product.class);
        query.setParameter("searchText", searchText);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Product> products = query.getResultList();

        // Count total results
        String countJpql = "SELECT COUNT(p) FROM Product p WHERE " +
                          "LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                          "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%'))";

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        countQuery.setParameter("searchText", searchText);
        long totalHits = countQuery.getSingleResult();

        return new PageImpl<>(products, pageable, totalHits);
    }

    /**
     * Search products by text in specific category.
     *
     * @param searchText the text to search for
     * @param category the category to filter by
     * @param pageable pagination information
     * @return Page of products matching the search criteria in the specified category
     */
    public Page<Product> searchProductsByCategory(String searchText, String category, Pageable pageable) {
        String jpql = "SELECT p FROM Product p WHERE " +
                     "p.category = :category AND " +
                     "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
                     "ORDER BY p.title ASC";

        TypedQuery<Product> query = entityManager.createQuery(jpql, Product.class);
        query.setParameter("searchText", searchText);
        query.setParameter("category", category);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Product> products = query.getResultList();

        // Count total results
        String countJpql = "SELECT COUNT(p) FROM Product p WHERE " +
                          "p.category = :category AND " +
                          "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                          "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%')))";

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        countQuery.setParameter("searchText", searchText);
        countQuery.setParameter("category", category);
        long totalHits = countQuery.getSingleResult();

        return new PageImpl<>(products, pageable, totalHits);
    }

    /**
     * Search products by text in specific brand.
     *
     * @param searchText the text to search for
     * @param brand the brand to filter by
     * @param pageable pagination information
     * @return Page of products matching the search criteria from the specified brand
     */
    public Page<Product> searchProductsByBrand(String searchText, String brand, Pageable pageable) {
        String jpql = "SELECT p FROM Product p WHERE " +
                     "p.brand = :brand AND " +
                     "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                     "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
                     "ORDER BY p.title ASC";

        TypedQuery<Product> query = entityManager.createQuery(jpql, Product.class);
        query.setParameter("searchText", searchText);
        query.setParameter("brand", brand);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<Product> products = query.getResultList();

        // Count total results
        String countJpql = "SELECT COUNT(p) FROM Product p WHERE " +
                          "p.brand = :brand AND " +
                          "(LOWER(p.title) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
                          "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchText, '%')))";

        TypedQuery<Long> countQuery = entityManager.createQuery(countJpql, Long.class);
        countQuery.setParameter("searchText", searchText);
        countQuery.setParameter("brand", brand);
        long totalHits = countQuery.getSingleResult();

        return new PageImpl<>(products, pageable, totalHits);
    }

    /**
     * Get search suggestions based on partial text.
     *
     * @param partialText the partial text to get suggestions for
     * @param maxSuggestions maximum number of suggestions to return
     * @return List of suggested search terms
     */
    public List<String> getSearchSuggestions(String partialText, int maxSuggestions) {
        String jpql = "SELECT DISTINCT p.title FROM Product p WHERE " +
                     "LOWER(p.title) LIKE LOWER(CONCAT('%', :partialText, '%')) " +
                     "ORDER BY p.title ASC";

        TypedQuery<String> query = entityManager.createQuery(jpql, String.class);
        query.setParameter("partialText", partialText);
        query.setMaxResults(maxSuggestions);

        return query.getResultList();
    }

    /**
     * Rebuild the search index for all products.
     * This is a no-op in the JPA implementation.
     */
    public void rebuildIndex() {
        // No-op for JPA implementation
        // In a real Hibernate Search implementation, this would rebuild the Lucene index
    }

    /**
     * Check if the search index is empty.
     * For JPA implementation, this checks if there are any products.
     *
     * @return true if there are no products, false otherwise
     */
    public boolean isIndexEmpty() {
        String jpql = "SELECT COUNT(p) FROM Product p";
        TypedQuery<Long> query = entityManager.createQuery(jpql, Long.class);
        long count = query.getSingleResult();
        return count == 0;
    }
}
