package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.ProjectBullet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for project bullet data access.
 */
@Repository
public interface ProjectBulletRepository extends JpaRepository<ProjectBullet, UUID> {

    /**
     * Finds all bullets for a project ordered by sort_order.
     */
    List<ProjectBullet> findByProjectIdOrderBySortOrderAsc(UUID projectId);

    /**
     * Finds the maximum sort order for bullets in a project.
     */
    @Query("SELECT COALESCE(MAX(b.sortOrder), 0) FROM ProjectBullet b WHERE b.project.id = :projectId")
    int findMaxSortOrderByProjectId(@Param("projectId") UUID projectId);

}
