package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for profile data access.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    /**
     * Gets the single profile row.
     */
    @Query("SELECT p FROM Profile p")
    Optional<Profile> findProfile();

}
