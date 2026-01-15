package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.ExperienceBullet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for experience bullet data access.
 */
@Repository
public interface ExperienceBulletRepository extends JpaRepository<ExperienceBullet, UUID> {

    /**
     * Finds all bullets for an experience ordered by sort_order.
     */
    List<ExperienceBullet> findByExperienceIdOrderBySortOrderAsc(UUID experienceId);

    /**
     * Finds the maximum sort order for bullets in an experience.
     */
    @Query("SELECT COALESCE(MAX(b.sortOrder), 0) FROM ExperienceBullet b WHERE b.experience.id = :experienceId")
    int findMaxSortOrderByExperienceId(@Param("experienceId") UUID experienceId);

}
