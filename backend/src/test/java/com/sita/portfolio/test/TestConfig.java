package com.sita.portfolio.test;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Test configuration that scans for test helper components.
 */
@TestConfiguration
@ComponentScan(basePackages = "com.sita.portfolio.test")
public class TestConfig {

}
