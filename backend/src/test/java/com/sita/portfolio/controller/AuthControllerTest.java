package com.sita.portfolio.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sita.portfolio.model.dto.request.LoginRequest;
import com.sita.portfolio.model.entity.AdminUser;
import com.sita.portfolio.repository.AdminUserRepository;
import com.sita.portfolio.security.JwtTokenProvider;
import com.sita.portfolio.test.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Authentication Controller Tests")
class AuthControllerTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private AdminUserRepository adminUserRepository;

    private AdminUser testAdmin;
    private static final String TEST_EMAIL = "admin@test.com";
    private static final String TEST_PASSWORD = "TestPassword123!";
    private static final UUID TEST_USER_ID = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        testAdmin = AdminUser.builder()
                .id(TEST_USER_ID)
                .email(TEST_EMAIL)
                .passwordHash(passwordEncoder.encode(TEST_PASSWORD))
                .displayName("Test Admin")
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class LoginTests {

        @Test
        @DisplayName("should return token for valid credentials")
        void login_withValidCredentials_returnsToken() throws Exception {
            when(adminUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testAdmin));
            when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testAdmin);

            LoginRequest request = LoginRequest.builder()
                    .email(TEST_EMAIL)
                    .password(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.accessToken").exists())
                    .andExpect(jsonPath("$.data.accessToken").isString())
                    .andExpect(jsonPath("$.data.expiresIn").isNumber())
                    .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                    .andExpect(jsonPath("$.timestamp").exists())
                    .andExpect(jsonPath("$.path").value("/api/auth/login"));
        }

        @Test
        @DisplayName("should return 401 for invalid password")
        void login_withInvalidPassword_returns401() throws Exception {
            when(adminUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testAdmin));

            LoginRequest request = LoginRequest.builder()
                    .email(TEST_EMAIL)
                    .password("WrongPassword!")
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.error").value("Unauthorized"))
                    .andExpect(jsonPath("$.message").value("Invalid email or password"));
        }

        @Test
        @DisplayName("should return 401 for unknown email")
        void login_withUnknownEmail_returns401() throws Exception {
            when(adminUserRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

            LoginRequest request = LoginRequest.builder()
                    .email("unknown@test.com")
                    .password(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.message").value("Invalid email or password"));
        }

        @Test
        @DisplayName("should return 401 for inactive user")
        void login_withInactiveUser_returns401() throws Exception {
            testAdmin.setActive(false);
            when(adminUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testAdmin));

            LoginRequest request = LoginRequest.builder()
                    .email(TEST_EMAIL)
                    .password(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Account is disabled"));
        }

        @Test
        @DisplayName("should return 400 for missing email")
        void login_withMissingEmail_returns400() throws Exception {
            LoginRequest request = LoginRequest.builder()
                    .password(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("email")));
        }

        @Test
        @DisplayName("should return 400 for invalid email format")
        void login_withInvalidEmailFormat_returns400() throws Exception {
            LoginRequest request = LoginRequest.builder()
                    .email("not-an-email")
                    .password(TEST_PASSWORD)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("email")));
        }

        @Test
        @DisplayName("should return 400 for missing password")
        void login_withMissingPassword_returns400() throws Exception {
            LoginRequest request = LoginRequest.builder()
                    .email(TEST_EMAIL)
                    .build();

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fieldErrors[*].field", hasItem("password")));
        }

        @Test
        @DisplayName("should accept 'username' field as alias for 'email'")
        void login_withUsernameField_works() throws Exception {
            when(adminUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testAdmin));
            when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testAdmin);

            String requestJson = String.format(
                    "{\"username\": \"%s\", \"password\": \"%s\"}",
                    TEST_EMAIL, TEST_PASSWORD
            );

            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestJson))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.accessToken").exists());
        }
    }

    @Nested
    @DisplayName("Protected Endpoints")
    class ProtectedEndpointTests {

        @Test
        @DisplayName("should return 401 for /api/admin/** without token")
        void adminEndpoint_withoutToken_returns401() throws Exception {
            mockMvc.perform(get("/api/admin/me"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401))
                    .andExpect(jsonPath("$.error").value("Unauthorized"));
        }

        @Test
        @DisplayName("should return 401 for /api/admin/** with invalid token")
        void adminEndpoint_withInvalidToken_returns401() throws Exception {
            mockMvc.perform(get("/api/admin/me")
                            .header("Authorization", "Bearer invalid.token.here"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("should return 200 for /api/admin/** with valid token")
        void adminEndpoint_withValidToken_returns200() throws Exception {
            String token = jwtTokenProvider.generateAccessToken(TEST_USER_ID, TEST_EMAIL, "ADMIN");

            mockMvc.perform(get("/api/admin/me")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.email").value(TEST_EMAIL))
                    .andExpect(jsonPath("$.data.role").value("ADMIN"));
        }

        @Test
        @DisplayName("should return 200 for /api/admin/dashboard with valid token")
        void adminDashboard_withValidToken_returns200() throws Exception {
            String token = jwtTokenProvider.generateAccessToken(TEST_USER_ID, TEST_EMAIL, "ADMIN");

            mockMvc.perform(get("/api/admin/dashboard")
                            .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.data.message").exists());
        }

        @Test
        @DisplayName("should allow access to /api/public/** without token")
        void publicEndpoint_withoutToken_returns200() throws Exception {
            mockMvc.perform(get("/api/public/health"))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("should allow access to /api/auth/login without token")
        void authEndpoint_withoutToken_isAccessible() throws Exception {
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest()); // 400 because of validation, not 401
        }
    }

    @Nested
    @DisplayName("Token Validation")
    class TokenValidationTests {

        @Test
        @DisplayName("returned token should be valid")
        void login_returnedToken_isValid() throws Exception {
            when(adminUserRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(testAdmin));
            when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testAdmin);

            LoginRequest request = LoginRequest.builder()
                    .email(TEST_EMAIL)
                    .password(TEST_PASSWORD)
                    .build();

            MvcResult result = mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andReturn();

            String responseBody = result.getResponse().getContentAsString();
            String token = objectMapper.readTree(responseBody)
                    .path("data")
                    .path("accessToken")
                    .asText();

            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
            assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo(TEST_EMAIL);
            assertThat(jwtTokenProvider.getRoleFromToken(token)).isEqualTo("ADMIN");
        }
    }

}
