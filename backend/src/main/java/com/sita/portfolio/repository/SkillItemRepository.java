package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.SkillItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for skill item data access.
 */
@Repository
public interface SkillItemRepository extends JpaRepository<SkillItem, UUID> {

    /**
     * Finds all skills for a category ordered by sort_order.
     */
    List<SkillItem> findByCategoryIdOrderBySortOrderAsc(UUID categoryId);

    /**
     * Finds the maximum sort order for skills in a category.
     */
    @Query("SELECT COALESCE(MAX(s.sortOrder), 0) FROM SkillItem s WHERE s.category.id = :categoryId")
    int findMaxSortOrderByCategoryId(@Param("categoryId") UUID categoryId);

}
