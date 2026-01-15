package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.ContactSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for contact settings data access.
 */
@Repository
public interface ContactSettingsRepository extends JpaRepository<ContactSettings, UUID> {

    /**
     * Gets the single contact settings row.
     */
    @Query("SELECT c FROM ContactSettings c")
    Optional<ContactSettings> findSettings();

}
