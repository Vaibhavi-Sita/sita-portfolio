package com.sita.portfolio.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.DockerClientFactory;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Abstract base class for integration tests.
 * 
 * This class automatically detects if Docker is available:
 * - If Docker is available: Uses Testcontainers with real PostgreSQL + Flyway migrations
 * - If Docker is NOT available: Falls back to H2 with Hibernate schema generation
 * 
 * All integration tests should extend this class to ensure consistent
 * database setup and configuration.
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    private static final Logger log = LoggerFactory.getLogger(AbstractIntegrationTest.class);

    private static final boolean DOCKER_AVAILABLE;
    private static final PostgreSQLContainer<?> postgres;

    static {
        // Detect Docker availability
        DOCKER_AVAILABLE = isDockerAvailable();

        if (DOCKER_AVAILABLE) {
            log.info("Docker detected - using Testcontainers PostgreSQL");
            postgres = new PostgreSQLContainer<>("postgres:15-alpine")
                    .withDatabaseName("portfolio_test")
                    .withUsername("test")
                    .withPassword("test");
            postgres.start();
        } else {
            log.info("Docker NOT detected - falling back to H2 in-memory database");
            postgres = null;
        }
    }

    private static boolean isDockerAvailable() {
        try {
            DockerClientFactory.instance().client();
            return true;
        } catch (Throwable ex) {
            return false;
        }
    }

    /**
     * Dynamically configure Spring datasource properties.
     * Uses PostgreSQL if Docker is available, H2 otherwise.
     */
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        if (DOCKER_AVAILABLE && postgres != null) {
            configurePostgres(registry);
        } else {
            configureH2(registry);
        }

        // Common configuration
        registry.add("app.environment.validation", () -> false);
        registry.add("app.jwt.secret", () -> "test-secret-key-for-testing-purposes-only-minimum-32-characters-long");
        registry.add("app.jwt.expiration-ms", () -> 900000);
        registry.add("app.cors.allowed-origin", () -> "http://localhost:4200");
    }

    private static void configurePostgres(DynamicPropertyRegistry registry) {
        // Database connection
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.datasource.driver-class-name", () -> "org.postgresql.Driver");

        // Flyway configuration - enable migrations for Postgres
        registry.add("spring.flyway.enabled", () -> true);
        registry.add("spring.flyway.schemas", () -> "portfolio");
        registry.add("spring.flyway.locations", () -> "classpath:db/migration");
        registry.add("spring.flyway.clean-disabled", () -> false);

        // JPA/Hibernate configuration
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.properties.hibernate.default_schema", () -> "portfolio");
    }

    private static void configureH2(DynamicPropertyRegistry registry) {
        // H2 database connection with PostgreSQL compatibility mode
        registry.add("spring.datasource.url", 
                () -> "jdbc:h2:mem:portfolio_test;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;INIT=CREATE SCHEMA IF NOT EXISTS portfolio");
        registry.add("spring.datasource.username", () -> "sa");
        registry.add("spring.datasource.password", () -> "");
        registry.add("spring.datasource.driver-class-name", () -> "org.h2.Driver");

        // Disable Flyway for H2 - use Hibernate schema generation
        registry.add("spring.flyway.enabled", () -> false);

        // JPA/Hibernate configuration - create schema from entities
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.jpa.properties.hibernate.default_schema", () -> "portfolio");
        registry.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.H2Dialect");

        // Enable data.sql for H2 to seed admin user
        registry.add("spring.sql.init.mode", () -> "always");
        registry.add("spring.sql.init.data-locations", () -> "classpath:data-h2.sql");
        registry.add("spring.jpa.defer-datasource-initialization", () -> true);
    }

    /**
     * Returns whether tests are running against PostgreSQL (via Docker) or H2.
     */
    protected static boolean isUsingPostgres() {
        return DOCKER_AVAILABLE;
    }

}
