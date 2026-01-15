package com.sita.portfolio.repository;

import com.sita.portfolio.model.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository for admin user data access.
 */
@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, UUID> {

    /**
     * Find an admin user by email address.
     */
    Optional<AdminUser> findByEmail(String email);

    /**
     * Find an active admin user by email address.
     */
    Optional<AdminUser> findByEmailAndActiveTrue(String email);

    /**
     * Check if an admin user exists with the given email.
     */
    boolean existsByEmail(String email);

}
