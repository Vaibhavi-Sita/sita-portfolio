package com.sita.portfolio.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.util.Optional;

/**
 * Logs basic, non-sensitive database connection details on startup.
 * Helps diagnose env var vs embedded credential issues.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseInfoLogger {

    private final DataSourceProperties dataSourceProperties;

    @EventListener(ApplicationReadyEvent.class)
    public void logDatabaseConnection() {
        String url = dataSourceProperties.getUrl();
        String username = dataSourceProperties.getUsername();
        boolean passwordPresent = dataSourceProperties.getPassword() != null;

        if (url == null || url.isBlank()) {
            log.warn("Database connection: url=<unset> username=<unset> passwordPresent=false");
            return;
        }

        ParsedJdbcInfo parsed = parseJdbcUrl(url);

        log.info(
                "Database connection resolved: host={} db={} username={} passwordPresent={}",
                parsed.host(),
                parsed.database(),
                username != null && !username.isBlank() ? username : "<unset>",
                passwordPresent
        );

        logEnvVisibility();
    }

    private void logEnvVisibility() {
        log.info(
                "Env visibility: SPRING_DATASOURCE_URL={} SPRING_DATASOURCE_USERNAME={} SPRING_DATASOURCE_PASSWORD_PRESENT={}",
                envPresent("SPRING_DATASOURCE_URL"),
                envPresent("SPRING_DATASOURCE_USERNAME"),
                System.getenv("SPRING_DATASOURCE_PASSWORD") != null
        );
    }

    private boolean envPresent(String key) {
        String value = System.getenv(key);
        return value != null && !value.isBlank();
    }

    private ParsedJdbcInfo parseJdbcUrl(String jdbcUrl) {
        String urlWithoutPrefix = jdbcUrl.startsWith("jdbc:")
                ? jdbcUrl.substring(5)
                : jdbcUrl;

        try {
            URI uri = URI.create(urlWithoutPrefix);

            String host = Optional.ofNullable(uri.getHost())
                    .filter(h -> !h.isBlank())
                    .orElse("<unknown>");

            String database = Optional.ofNullable(uri.getPath())
                    .map(path -> path.replaceFirst("^/", ""))
                    .filter(db -> !db.isBlank())
                    .orElse("<unknown>");

            return new ParsedJdbcInfo(host, database);
        } catch (IllegalArgumentException ex) {
            return new ParsedJdbcInfo("<unparsed>", "<unparsed>");
        }
    }

    private record ParsedJdbcInfo(String host, String database) {}
}
