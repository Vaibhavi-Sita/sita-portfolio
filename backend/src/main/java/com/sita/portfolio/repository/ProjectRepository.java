package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for project data access.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    /**
     * Finds all published projects ordered by sort_order.
     */
    List<Project> findByPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all featured and published projects ordered by sort_order.
     */
    List<Project> findByFeaturedTrueAndPublishedTrueOrderBySortOrderAsc();

    /**
     * Finds all projects ordered by sort_order (for admin).
     */
    List<Project> findAllByOrderBySortOrderAsc();

    /**
     * Finds a project by slug.
     */
    Optional<Project> findBySlug(String slug);

    /**
     * Finds a published project by slug.
     */
    Optional<Project> findBySlugAndPublishedTrue(String slug);

    /**
     * Checks if a slug already exists.
     */
    boolean existsBySlug(String slug);

    /**
     * Finds the maximum sort order value.
     */
    @Query("SELECT COALESCE(MAX(p.sortOrder), 0) FROM Project p")
    int findMaxSortOrder();

}
