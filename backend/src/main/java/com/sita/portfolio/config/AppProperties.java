package com.sita.portfolio.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application configuration properties bound from application.yml.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private long expirationMs = 900000; // 15 minutes
        private long refreshExpirationMs = 604800000; // 7 days
    }

    @Getter
    @Setter
    public static class Cors {
        private String allowedOrigin = "http://localhost:4200";
    }

}
