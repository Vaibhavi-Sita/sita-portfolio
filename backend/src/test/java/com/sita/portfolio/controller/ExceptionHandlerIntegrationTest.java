package com.sita.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sita.portfolio.exception.ForbiddenException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.exception.UnauthorizedException;
import com.sita.portfolio.model.dto.request.LoginRequest;
import com.sita.portfolio.test.AbstractIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Exception Handler Integration Tests")
class ExceptionHandlerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @TestConfiguration
    static class TestControllerConfig {
        @Bean
        public TestExceptionController testExceptionController() {
            return new TestExceptionController();
        }
    }

    /**
     * Test controller that throws various exceptions for testing the exception handler.
     * Uses /api/public/** path to bypass security for testing exception handling.
     */
    @RestController
    @RequestMapping("/api/public/test")
    static class TestExceptionController {

        @GetMapping("/not-found")
        public void throwNotFound() {
            throw new ResourceNotFoundException("TestResource", "id", "123");
        }

        @GetMapping("/unauthorized")
        public void throwUnauthorized() {
            throw new UnauthorizedException("Invalid token");
        }

        @GetMapping("/forbidden")
        public void throwForbidden() {
            throw new ForbiddenException("Access denied");
        }

        @GetMapping("/error")
        public void throwError() {
            throw new RuntimeException("Unexpected error");
        }

        @PostMapping("/validate")
        public void validateRequest(@Valid @RequestBody LoginRequest request) {
            // Just validates the request
        }
    }

    @Test
    @DisplayName("should return 400 with field errors for invalid DTO")
    void invalidDto_returns400WithFieldErrors() throws Exception {
        LoginRequest invalidRequest = LoginRequest.builder()
                .email("not-an-email")
                .password("short")
                .build();

        mockMvc.perform(post("/api/public/test/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors").isArray())
                .andExpect(jsonPath("$.fieldErrors", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.fieldErrors[*].field").exists())
                .andExpect(jsonPath("$.fieldErrors[*].message").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/public/test/validate"));
    }

    @Test
    @DisplayName("should return 400 for empty request body")
    void emptyRequestBody_returns400() throws Exception {
        mockMvc.perform(post("/api/public/test/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }

    @Test
    @DisplayName("should return 400 for malformed JSON")
    void malformedJson_returns400() throws Exception {
        mockMvc.perform(post("/api/public/test/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{invalid json}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Malformed Request"));
    }

    @Test
    @DisplayName("should return 404 for missing resource")
    void resourceNotFound_returns404() throws Exception {
        mockMvc.perform(get("/api/public/test/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value(containsString("TestResource")))
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.path").value("/api/public/test/not-found"))
                .andExpect(jsonPath("$.correlationId").doesNotExist());
    }

    @Test
    @DisplayName("should return 401 for unauthorized access")
    void unauthorized_returns401() throws Exception {
        mockMvc.perform(get("/api/public/test/unauthorized"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Invalid token"));
    }

    @Test
    @DisplayName("should return 403 for forbidden access")
    void forbidden_returns403() throws Exception {
        mockMvc.perform(get("/api/public/test/forbidden"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.error").value("Forbidden"))
                .andExpect(jsonPath("$.message").value("Access denied"));
    }

    @Test
    @DisplayName("should return 500 with correlation ID for unhandled errors")
    void unhandledError_returns500WithCorrelationId() throws Exception {
        mockMvc.perform(get("/api/public/test/error"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.correlationId").exists())
                .andExpect(jsonPath("$.correlationId").isString())
                .andExpect(jsonPath("$.message").value(containsString("correlation ID")));
    }

    @Test
    @DisplayName("should return 405 for unsupported HTTP method")
    void unsupportedMethod_returns405() throws Exception {
        mockMvc.perform(delete("/api/public/test/not-found"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.status").value(405))
                .andExpect(jsonPath("$.error").value("Method Not Allowed"));
    }

}
