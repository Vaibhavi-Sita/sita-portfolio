package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.security.JwtAuthenticationFilter.JwtAuthenticatedUser;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Admin controller for protected endpoints.
 * All endpoints require ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    /**
     * Returns the current authenticated admin user's info.
     * GET /api/admin/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(
            @AuthenticationPrincipal JwtAuthenticatedUser user,
            HttpServletRequest request) {

        log.debug("Getting current user info for: {}", user.email());

        Map<String, Object> userData = Map.of(
                "id", user.id().toString(),
                "email", user.email(),
                "role", user.role()
        );

        return ResponseEntity.ok(ApiResponse.success(userData, request.getRequestURI()));
    }

    /**
     * Dashboard endpoint to verify admin access.
     * GET /api/admin/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, String>>> dashboard(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                Map.of("message", "Welcome to the admin dashboard"),
                request.getRequestURI()
        ));
    }

    /**
     * Database diagnostic endpoint for admins.
     * GET /api/admin/diag/db
     */
    @GetMapping("/diag/db")
    public ResponseEntity<ApiResponse<Map<String, Object>>> databaseDiagnostics(HttpServletRequest request) {
        Map<String, Object> row = jdbcTemplate.queryForMap(
                "SELECT current_database() AS current_database, inet_server_addr() AS inet_server_addr, current_user AS current_user"
        );

        Map<String, Object> data = Map.of(
                "currentDatabase", String.valueOf(row.get("current_database")),
                "serverAddress", String.valueOf(row.get("inet_server_addr")),
                "currentUser", String.valueOf(row.get("current_user"))
        );

        return ResponseEntity.ok(ApiResponse.success(data, request.getRequestURI()));
    }

}
