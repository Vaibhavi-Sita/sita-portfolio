package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for education data access.
 */
@Repository
public interface EducationRepository extends JpaRepository<Education, UUID> {

    /**
     * Finds all published education entries ordered by sort_order.
     */
    List<Education> findByPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all education entries ordered by sort_order (for admin).
     */
    List<Education> findAllByOrderBySortOrderAsc();

    /**
     * Finds the maximum sort order value.
     */
    @Query("SELECT COALESCE(MAX(e.sortOrder), 0) FROM Education e")
    int findMaxSortOrder();

}
