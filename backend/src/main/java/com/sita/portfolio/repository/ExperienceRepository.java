package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for experience data access.
 */
@Repository
public interface ExperienceRepository extends JpaRepository<Experience, UUID> {

    /**
     * Finds all published experiences ordered by sort_order.
     */
    List<Experience> findByPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all experiences ordered by sort_order (for admin).
     */
    List<Experience> findAllByOrderBySortOrderAsc();

    /**
     * Finds the maximum sort order value.
     */
    @Query("SELECT COALESCE(MAX(e.sortOrder), 0) FROM Experience e")
    int findMaxSortOrder();

}
