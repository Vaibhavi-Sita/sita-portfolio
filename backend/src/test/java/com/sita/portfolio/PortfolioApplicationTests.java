package com.sita.portfolio;

import com.sita.portfolio.test.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Basic Spring Boot context loading test.
 * Verifies the application starts correctly with Testcontainers PostgreSQL.
 */
@DisplayName("Application Context Tests")
class PortfolioApplicationTests extends AbstractIntegrationTest {

    @Test
    @DisplayName("Application context loads successfully")
    void contextLoads() {
        // If this test passes, the Spring context loaded successfully
        // with Testcontainers PostgreSQL and Flyway migrations ran
    }

}
