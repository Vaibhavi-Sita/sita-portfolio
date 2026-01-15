package com.sita.portfolio.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sita.portfolio.model.dto.request.LoginRequest;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for admin security and JWT authentication.
 * Tests that admin endpoints require valid JWT tokens and proper authorization.
 */
@Import(TestConfig.class)
class AdminSecurityIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestHelper testHelper;

    @BeforeEach
    void setUp() {
        testHelper.clearAllData();
    }

    @AfterEach
    void tearDown() {
        testHelper.clearAllData();
    }

    // ===== Public Endpoints - No Auth Required =====

    @Test
    @DisplayName("Public health endpoint does not require authentication")
    void publicHealthEndpointNoAuth() throws Exception {
        mockMvc.perform(get("/api/public/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public experience endpoint does not require authentication")
    void publicExperienceEndpointNoAuth() throws Exception {
        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public projects endpoint does not require authentication")
    void publicProjectsEndpointNoAuth() throws Exception {
        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Public skills endpoint does not require authentication")
    void publicSkillsEndpointNoAuth() throws Exception {
        mockMvc.perform(get("/api/public/skills"))
                .andExpect(status().isOk());
    }

    // ===== Login Endpoint =====

    @Test
    @DisplayName("Login endpoint returns 401 for invalid password")
    void loginReturns401ForInvalidPassword() throws Exception {
        LoginRequest request = new LoginRequest("admin@portfolio.local", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Login endpoint returns 401 for non-existent user")
    void loginReturns401ForNonExistentUser() throws Exception {
        LoginRequest request = new LoginRequest("nonexistent@example.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Login endpoint returns 400 for missing credentials")
    void loginReturns400ForMissingCredentials() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }

    // ===== Admin Endpoints - Auth Required =====

    @Test
    @DisplayName("Admin profile endpoint returns 401 without token")
    void adminProfileEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(get("/api/admin/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin experience endpoint returns 401 without token")
    void adminExperienceEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(get("/api/admin/experience"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin projects endpoint returns 401 without token")
    void adminProjectsEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(get("/api/admin/projects"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin import endpoint returns 401 without token")
    void adminImportEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(post("/api/admin/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin reorder endpoint returns 401 without token")
    void adminReorderEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(put("/api/admin/experience/reorder")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[]"))
                .andExpect(status().isUnauthorized());
    }

    // ===== Admin Endpoints - Valid Auth =====

    @Test
    @DisplayName("Admin profile endpoint returns OK with valid token")
    void adminProfileEndpointReturns200WithToken() throws Exception {
        testHelper.createProfile("Test User", "Developer");

        mockMvc.perform(get("/api/admin/profile")
                        .header("Authorization", testHelper.adminBearerToken()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Admin experience endpoint returns OK with valid token")
    void adminExperienceEndpointReturns200WithToken() throws Exception {
        mockMvc.perform(get("/api/admin/experience")
                        .header("Authorization", testHelper.adminBearerToken()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Admin projects endpoint returns OK with valid token")
    void adminProjectsEndpointReturns200WithToken() throws Exception {
        mockMvc.perform(get("/api/admin/projects")
                        .header("Authorization", testHelper.adminBearerToken()))
                .andExpect(status().isOk());
    }

    // ===== Invalid Token Handling =====

    @Test
    @DisplayName("Admin endpoint returns 401 for malformed token")
    void adminEndpointReturns401ForMalformedToken() throws Exception {
        mockMvc.perform(get("/api/admin/profile")
                        .header("Authorization", "Bearer invalid.token.here"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin endpoint returns 401 for missing Bearer prefix")
    void adminEndpointReturns401ForMissingBearerPrefix() throws Exception {
        String token = testHelper.generateAdminToken();
        
        mockMvc.perform(get("/api/admin/profile")
                        .header("Authorization", token))  // Missing "Bearer " prefix
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Admin endpoint returns 401 for empty token")
    void adminEndpointReturns401ForEmptyToken() throws Exception {
        mockMvc.perform(get("/api/admin/profile")
                        .header("Authorization", "Bearer "))
                .andExpect(status().isUnauthorized());
    }

    // ===== Create Operations - Auth Required =====

    @Test
    @DisplayName("Create experience returns 401 without token")
    void createExperienceReturns401WithoutToken() throws Exception {
        String experienceJson = """
            {
                "company": "Test Corp",
                "role": "Developer",
                "startDate": "2023-01-01"
            }
            """;

        mockMvc.perform(post("/api/admin/experience")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(experienceJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Create experience returns 201 with valid token")
    void createExperienceReturns201WithToken() throws Exception {
        String experienceJson = """
            {
                "company": "Test Corp",
                "role": "Developer",
                "startDate": "2023-01-01"
            }
            """;

        mockMvc.perform(post("/api/admin/experience")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(experienceJson))
                .andExpect(status().isCreated());
    }

    // ===== Delete Operations - Auth Required =====

    @Test
    @DisplayName("Delete experience returns 401 without token")
    void deleteExperienceReturns401WithoutToken() throws Exception {
        var experience = testHelper.createExperience("Test Corp", "Dev", 1, true);

        mockMvc.perform(delete("/api/admin/experience/" + experience.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Delete experience returns 200 with valid token")
    void deleteExperienceReturns200WithToken() throws Exception {
        var experience = testHelper.createExperience("Test Corp", "Dev", 1, true);

        mockMvc.perform(delete("/api/admin/experience/" + experience.getId())
                        .header("Authorization", testHelper.adminBearerToken()))
                .andExpect(status().isOk());
    }

    // ===== Publish Toggle - Auth Required =====

    @Test
    @DisplayName("Publish toggle returns 401 without token")
    void publishToggleReturns401WithoutToken() throws Exception {
        var experience = testHelper.createExperience("Test Corp", "Dev", 1, true);

        mockMvc.perform(patch("/api/admin/experience/" + experience.getId() + "/publish")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isPublished\": false}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Publish toggle returns 200 with valid token")
    void publishToggleReturns200WithToken() throws Exception {
        var experience = testHelper.createExperience("Test Corp", "Dev", 1, true);

        mockMvc.perform(patch("/api/admin/experience/" + experience.getId() + "/publish")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"isPublished\": false}"))
                .andExpect(status().isOk());
    }

    // ===== Concurrent Requests with Same Token =====

    @Test
    @DisplayName("Multiple requests with same token all succeed")
    void multipleRequestsWithSameTokenSucceed() throws Exception {
        String token = testHelper.adminBearerToken();

        mockMvc.perform(get("/api/admin/experience")
                        .header("Authorization", token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/projects")
                        .header("Authorization", token))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/admin/skills")
                        .header("Authorization", token))
                .andExpect(status().isOk());
    }

}
