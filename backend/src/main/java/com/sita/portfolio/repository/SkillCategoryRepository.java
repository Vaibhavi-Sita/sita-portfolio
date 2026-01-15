package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for skill category data access.
 */
@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, UUID> {

    /**
     * Finds all published skill categories ordered by sort_order.
     */
    List<SkillCategory> findByPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all skill categories ordered by sort_order (for admin).
     */
    List<SkillCategory> findAllByOrderBySortOrderAsc();

    /**
     * Finds the maximum sort order value.
     */
    @Query("SELECT COALESCE(MAX(c.sortOrder), 0) FROM SkillCategory c")
    int findMaxSortOrder();

}
