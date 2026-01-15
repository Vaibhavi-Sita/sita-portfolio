package com.sita.portfolio.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Main application configuration class.
 */
@Configuration
@EnableConfigurationProperties(AppProperties.class)
public class AppConfig {

}
