package com.sita.portfolio.service;

import com.sita.portfolio.exception.UnauthorizedException;
import com.sita.portfolio.model.dto.request.LoginRequest;
import com.sita.portfolio.model.dto.response.LoginResponse;
import com.sita.portfolio.model.entity.AdminUser;
import com.sita.portfolio.repository.AdminUserRepository;
import com.sita.portfolio.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Service for authentication operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Authenticates an admin user and returns a JWT token.
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // Find admin user by email
        AdminUser adminUser = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login attempt with unknown email: {}", request.getEmail());
                    return new UnauthorizedException("Invalid email or password");
                });

        // Check if user is active
        if (!adminUser.isActive()) {
            log.warn("Login attempt for inactive user: {}", request.getEmail());
            throw new UnauthorizedException("Account is disabled");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), adminUser.getPasswordHash())) {
            log.warn("Invalid password for user: {}", request.getEmail());
            throw new UnauthorizedException("Invalid email or password");
        }

        // Update last login timestamp
        adminUser.setLastLoginAt(Instant.now());
        adminUserRepository.save(adminUser);

        // Generate JWT token
        String accessToken = jwtTokenProvider.generateAccessToken(
                adminUser.getId(),
                adminUser.getEmail(),
                "ADMIN"
        );

        long expiresIn = jwtTokenProvider.getExpirationSeconds();

        log.info("Successful login for user: {}", adminUser.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)
                .expiresIn(expiresIn)
                .tokenType("Bearer")
                .build();
    }

}
