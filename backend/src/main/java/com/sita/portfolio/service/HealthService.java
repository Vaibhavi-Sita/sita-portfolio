package com.sita.portfolio.service;

import com.sita.portfolio.model.dto.HealthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Service for health check operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HealthService {

    private final DataSource dataSource;

    @Value("${spring.application.name:portfolio-api}")
    private String applicationName;

    /**
     * Returns the current health status of the application.
     */
    public HealthResponse getHealthStatus() {
        boolean databaseHealthy = checkDatabaseConnection();
        String status = databaseHealthy ? "UP" : "DEGRADED";

        return HealthResponse.builder()
                .status(status)
                .database(databaseHealthy ? "UP" : "DOWN")
                .version("1.0.0")
                .build();
    }

    private boolean checkDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.isValid(5);
        } catch (Exception e) {
            log.warn("Database health check failed: {}", e.getMessage());
            return false;
        }
    }

}
