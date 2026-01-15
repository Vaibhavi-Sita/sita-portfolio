package com.sita.portfolio.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Validates that all required environment variables are present at startup.
 * Fails fast with clear error messages if configuration is incomplete.
 * Disabled when app.environment.validation=false (used in tests).
 */
@Component
@ConditionalOnProperty(name = "app.environment.validation", havingValue = "true", matchIfMissing = true)
@Slf4j
public class EnvironmentValidator {

    private static final Pattern JDBC_URL_PATTERN = Pattern.compile(
            "jdbc:postgresql://([^:/]+)(:\\d+)?/([^?]+)(\\?.*)?"
    );

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${JWT_SECRET:}")
    private String jwtSecret;

    @PostConstruct
    public void validateEnvironment() {
        List<String> errors = new ArrayList<>();

        // Validate datasource URL
        if (isBlank(datasourceUrl)) {
            errors.add("SPRING_DATASOURCE_URL is not set");
        } else if (!isValidJdbcUrl(datasourceUrl)) {
            errors.add("SPRING_DATASOURCE_URL is invalid. Expected format: jdbc:postgresql://host:port/database?...");
        }

        // Validate JWT secret
        if (isBlank(jwtSecret)) {
            errors.add("JWT_SECRET is not set");
        } else if (jwtSecret.length() < 32) {
            errors.add("JWT_SECRET must be at least 32 characters (currently: " + jwtSecret.length() + " chars)");
        }

        // Fail fast if any errors
        if (!errors.isEmpty()) {
            String errorMessage = buildErrorMessage(errors);
            log.error(errorMessage);
            throw new IllegalStateException("Missing or invalid environment configuration");
        }

        log.debug("Environment validation passed");
    }

    /**
     * Extracts the host from a JDBC URL for logging purposes.
     * Redacts any credentials present in the URL.
     */
    public String extractHostFromUrl(String jdbcUrl) {
        if (isBlank(jdbcUrl)) {
            return "[not configured]";
        }

        Matcher matcher = JDBC_URL_PATTERN.matcher(jdbcUrl);
        if (matcher.matches()) {
            String host = matcher.group(1);
            String port = matcher.group(2) != null ? matcher.group(2) : ":5432";
            String database = matcher.group(3);
            return host + port + "/" + database;
        }

        return "[invalid URL]";
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean isValidJdbcUrl(String url) {
        if (!url.startsWith("jdbc:postgresql://")) {
            return false;
        }
        return JDBC_URL_PATTERN.matcher(url).matches();
    }

    private String buildErrorMessage(List<String> errors) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n");
        sb.append("╔══════════════════════════════════════════════════════════════════════╗\n");
        sb.append("║            MISSING OR INVALID ENVIRONMENT CONFIGURATION              ║\n");
        sb.append("╠══════════════════════════════════════════════════════════════════════╣\n");
        sb.append("║                                                                      ║\n");
        for (String error : errors) {
            sb.append(String.format("║  ✗ %-66s║%n", error));
        }
        sb.append("║                                                                      ║\n");
        sb.append("╠══════════════════════════════════════════════════════════════════════╣\n");
        sb.append("║  To fix:                                                             ║\n");
        sb.append("║  1. Copy backend/.env.example to backend/.env                        ║\n");
        sb.append("║  2. Get your JDBC URL from Supabase Dashboard:                       ║\n");
        sb.append("║     Project Settings → Database → Connection String → JDBC           ║\n");
        sb.append("║     Select 'Session pooler' for IPv4 compatibility                   ║\n");
        sb.append("║  3. Set SPRING_DATASOURCE_URL to the full JDBC URL                   ║\n");
        sb.append("║  4. Generate JWT_SECRET with: openssl rand -base64 48                ║\n");
        sb.append("║  5. Restart the application                                          ║\n");
        sb.append("║                                                                      ║\n");
        sb.append("║  See docs/SUPABASE_SETUP.md for detailed instructions.               ║\n");
        sb.append("╚══════════════════════════════════════════════════════════════════════╝\n");
        return sb.toString();
    }

}
