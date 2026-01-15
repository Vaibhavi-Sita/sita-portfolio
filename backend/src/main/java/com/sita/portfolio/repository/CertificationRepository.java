package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for certification data access.
 */
@Repository
public interface CertificationRepository extends JpaRepository<Certification, UUID> {

    /**
     * Finds all published certifications ordered by sort_order.
     */
    List<Certification> findByPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all certifications ordered by sort_order (for admin).
     */
    List<Certification> findAllByOrderBySortOrderAsc();

    /**
     * Finds the maximum sort order value.
     */
    @Query("SELECT COALESCE(MAX(c.sortOrder), 0) FROM Certification c")
    int findMaxSortOrder();

}
