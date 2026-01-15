package com.sita.portfolio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Logs a confirmation message at startup with key configuration details.
 * Ensures no secrets are exposed in logs.
 */
@Component
@Slf4j
public class StartupLogger {

    private static final Pattern JDBC_URL_PATTERN = Pattern.compile(
            "jdbc:postgresql://([^:/]+)(:\\d+)?/([^?]+)(\\?.*)?"
    );

    private final Environment environment;
    private final Optional<EnvironmentValidator> environmentValidator;
    private final Optional<Flyway> flyway;

    @Autowired
    public StartupLogger(
            Environment environment,
            @Autowired(required = false) EnvironmentValidator environmentValidator,
            @Autowired(required = false) Flyway flyway) {
        this.environment = environment;
        this.environmentValidator = Optional.ofNullable(environmentValidator);
        this.flyway = Optional.ofNullable(flyway);
    }

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${server.port:8080}")
    private int serverPort;

    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        String activeProfiles = getActiveProfiles();
        String dbHost = extractHostFromUrl(datasourceUrl);
        String flywayStatus = getFlywayStatus();

        log.info("═══════════════════════════════════════════════════════════════");
        log.info("  Portfolio API started successfully");
        log.info("  ─────────────────────────────────────────────────────────────");
        log.info("  Profile:    {}", activeProfiles);
        log.info("  Database:   {}", dbHost);
        log.info("  Flyway:     {}", flywayStatus);
        log.info("  Server:     http://localhost:{}", serverPort);
        log.info("  Health:     http://localhost:{}/api/public/health", serverPort);
        log.info("═══════════════════════════════════════════════════════════════");
    }

    private String getActiveProfiles() {
        String[] profiles = environment.getActiveProfiles();
        if (profiles.length == 0) {
            return "default";
        }
        return String.join(", ", profiles);
    }

    private String extractHostFromUrl(String jdbcUrl) {
        // Delegate to validator if available
        if (environmentValidator.isPresent()) {
            return environmentValidator.get().extractHostFromUrl(jdbcUrl);
        }

        // Fallback extraction logic
        if (jdbcUrl == null || jdbcUrl.isEmpty()) {
            return "[not configured]";
        }

        // Handle H2 test database
        if (jdbcUrl.startsWith("jdbc:h2:")) {
            return "H2 (in-memory)";
        }

        Matcher matcher = JDBC_URL_PATTERN.matcher(jdbcUrl);
        if (matcher.matches()) {
            String host = matcher.group(1);
            String port = matcher.group(2) != null ? matcher.group(2) : ":5432";
            String database = matcher.group(3);
            return host + port + "/" + database;
        }

        return "[unknown]";
    }

    private String getFlywayStatus() {
        if (flyway.isEmpty()) {
            return "disabled";
        }

        try {
            var info = flyway.get().info();
            var current = info.current();
            if (current != null) {
                return "v" + current.getVersion() + " (" + current.getDescription() + ")";
            }
            return "baseline";
        } catch (Exception e) {
            log.debug("Could not get Flyway info: {}", e.getMessage());
            return "migrations applied";
        }
    }

}
