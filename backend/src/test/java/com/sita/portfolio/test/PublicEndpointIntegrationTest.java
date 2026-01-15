package com.sita.portfolio.test;

import com.sita.portfolio.model.entity.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for public API endpoints.
 * Tests filtering by publish flag and ordering by sort_order.
 * 
 * Uses Testcontainers PostgreSQL with Flyway migrations.
 */
@Import(TestConfig.class)
@Transactional
class PublicEndpointIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TestHelper testHelper;

    @BeforeEach
    void setUp() {
        testHelper.clearAllData();
    }

    // ===== Health Endpoint =====

    @Test
    @DisplayName("Health endpoint returns OK")
    void healthEndpointReturnsOk() throws Exception {
        mockMvc.perform(get("/api/public/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("UP"));
    }

    // ===== Profile Endpoint =====

    @Test
    @DisplayName("Profile endpoint returns profile data")
    void profileEndpointReturnsData() throws Exception {
        testHelper.createProfile("John Doe", "Software Engineer");

        mockMvc.perform(get("/api/public/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("John Doe"))
                .andExpect(jsonPath("$.data.title").value("Software Engineer"));
    }

    @Test
    @DisplayName("Profile endpoint returns 404 when no profile exists")
    void profileEndpointReturns404WhenEmpty() throws Exception {
        mockMvc.perform(get("/api/public/profile"))
                .andExpect(status().isNotFound());
    }

    // ===== Experience Endpoint - Publish Filter =====

    @Test
    @DisplayName("Experience endpoint only returns published items")
    void experienceEndpointFiltersUnpublished() throws Exception {
        testHelper.createExperience("Published Corp", "Developer", 1, true);
        testHelper.createExperience("Hidden Corp", "Developer", 2, false);
        testHelper.createExperience("Another Published", "Engineer", 3, true);

        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].company", 
                        containsInAnyOrder("Published Corp", "Another Published")))
                .andExpect(jsonPath("$.data[*].company", 
                        not(hasItem("Hidden Corp"))));
    }

    // ===== Experience Endpoint - Sort Order =====

    @Test
    @DisplayName("Experience endpoint returns items in sort_order ASC")
    void experienceEndpointReturnsSortedBySortOrder() throws Exception {
        // Create in random order
        testHelper.createExperience("Third", "Dev", 3, true);
        testHelper.createExperience("First", "Dev", 1, true);
        testHelper.createExperience("Second", "Dev", 2, true);

        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].company").value("First"))
                .andExpect(jsonPath("$.data[1].company").value("Second"))
                .andExpect(jsonPath("$.data[2].company").value("Third"));
    }

    @Test
    @DisplayName("Experience bullets are returned in sort order")
    void experienceBulletsReturnedInOrder() throws Exception {
        testHelper.createExperienceWithBullets("Company", "Role", 1, true,
                "First bullet", "Second bullet", "Third bullet");

        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].bullets", hasSize(3)))
                .andExpect(jsonPath("$.data[0].bullets[0].content").value("First bullet"))
                .andExpect(jsonPath("$.data[0].bullets[1].content").value("Second bullet"))
                .andExpect(jsonPath("$.data[0].bullets[2].content").value("Third bullet"));
    }

    // ===== Projects Endpoint - Publish Filter =====

    @Test
    @DisplayName("Projects endpoint only returns published items")
    void projectsEndpointFiltersUnpublished() throws Exception {
        testHelper.createProject("Published Project", 1, true, false);
        testHelper.createProject("Draft Project", 2, false, true);
        testHelper.createProject("Another Published", 3, true, true);

        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].title", 
                        containsInAnyOrder("Published Project", "Another Published")))
                .andExpect(jsonPath("$.data[*].title", 
                        not(hasItem("Draft Project"))));
    }

    // ===== Projects Endpoint - Sort Order =====

    @Test
    @DisplayName("Projects endpoint returns items in sort_order ASC")
    void projectsEndpointReturnsSortedBySortOrder() throws Exception {
        testHelper.createProject("C Project", 3, true, false);
        testHelper.createProject("A Project", 1, true, false);
        testHelper.createProject("B Project", 2, true, false);

        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].title").value("A Project"))
                .andExpect(jsonPath("$.data[1].title").value("B Project"))
                .andExpect(jsonPath("$.data[2].title").value("C Project"));
    }

    @Test
    @DisplayName("Project bullets are returned in sort order")
    void projectBulletsReturnedInOrder() throws Exception {
        testHelper.createProjectWithBullets("Test Project", 1, true, false,
                "Feature 1", "Feature 2", "Feature 3");

        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].bullets", hasSize(3)))
                .andExpect(jsonPath("$.data[0].bullets[0].content").value("Feature 1"))
                .andExpect(jsonPath("$.data[0].bullets[1].content").value("Feature 2"))
                .andExpect(jsonPath("$.data[0].bullets[2].content").value("Feature 3"));
    }

    // ===== Skills Endpoint - Publish Filter =====

    @Test
    @DisplayName("Skills endpoint only returns published categories")
    void skillsEndpointFiltersUnpublished() throws Exception {
        testHelper.createSkillCategoryWithItems("Languages", 1, true, "Java", "Python");
        testHelper.createSkillCategoryWithItems("Hidden Category", 2, false, "Secret");
        testHelper.createSkillCategoryWithItems("Frameworks", 3, true, "Spring");

        mockMvc.perform(get("/api/public/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].name", 
                        containsInAnyOrder("Languages", "Frameworks")))
                .andExpect(jsonPath("$.data[*].name", 
                        not(hasItem("Hidden Category"))));
    }

    // ===== Skills Endpoint - Sort Order =====

    @Test
    @DisplayName("Skills endpoint returns categories in sort_order ASC")
    void skillsEndpointReturnsSortedBySortOrder() throws Exception {
        testHelper.createSkillCategory("C Category", 3, true);
        testHelper.createSkillCategory("A Category", 1, true);
        testHelper.createSkillCategory("B Category", 2, true);

        mockMvc.perform(get("/api/public/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].name").value("A Category"))
                .andExpect(jsonPath("$.data[1].name").value("B Category"))
                .andExpect(jsonPath("$.data[2].name").value("C Category"));
    }

    @Test
    @DisplayName("Skill items are returned in sort order within categories")
    void skillItemsReturnedInOrder() throws Exception {
        testHelper.createSkillCategoryWithItems("Languages", 1, true,
                "Java", "Python", "TypeScript");

        mockMvc.perform(get("/api/public/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].skills", hasSize(3)))
                .andExpect(jsonPath("$.data[0].skills[0].name").value("Java"))
                .andExpect(jsonPath("$.data[0].skills[1].name").value("Python"))
                .andExpect(jsonPath("$.data[0].skills[2].name").value("TypeScript"));
    }

    // ===== Education Endpoint - Publish Filter =====

    @Test
    @DisplayName("Education endpoint only returns published items")
    void educationEndpointFiltersUnpublished() throws Exception {
        testHelper.createEducation("Published University", "BS", 1, true);
        testHelper.createEducation("Draft School", "MS", 2, false);
        testHelper.createEducation("Another Published", "PhD", 3, true);

        mockMvc.perform(get("/api/public/education"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].institution", 
                        containsInAnyOrder("Published University", "Another Published")))
                .andExpect(jsonPath("$.data[*].institution", 
                        not(hasItem("Draft School"))));
    }

    // ===== Education Endpoint - Sort Order =====

    @Test
    @DisplayName("Education endpoint returns items in sort_order ASC")
    void educationEndpointReturnsSortedBySortOrder() throws Exception {
        testHelper.createEducation("Third School", "BS", 3, true);
        testHelper.createEducation("First School", "BS", 1, true);
        testHelper.createEducation("Second School", "BS", 2, true);

        mockMvc.perform(get("/api/public/education"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].institution").value("First School"))
                .andExpect(jsonPath("$.data[1].institution").value("Second School"))
                .andExpect(jsonPath("$.data[2].institution").value("Third School"));
    }

    // ===== Certifications Endpoint - Publish Filter =====

    @Test
    @DisplayName("Certifications endpoint only returns published items")
    void certificationsEndpointFiltersUnpublished() throws Exception {
        testHelper.createCertification("AWS Certified", "Amazon", 1, true);
        testHelper.createCertification("Draft Cert", "Issuer", 2, false);
        testHelper.createCertification("GCP Certified", "Google", 3, true);

        mockMvc.perform(get("/api/public/certifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[*].name", 
                        containsInAnyOrder("AWS Certified", "GCP Certified")))
                .andExpect(jsonPath("$.data[*].name", 
                        not(hasItem("Draft Cert"))));
    }

    // ===== Certifications Endpoint - Sort Order =====

    @Test
    @DisplayName("Certifications endpoint returns items in sort_order ASC")
    void certificationsEndpointReturnsSortedBySortOrder() throws Exception {
        testHelper.createCertification("Z Cert", "Issuer", 3, true);
        testHelper.createCertification("A Cert", "Issuer", 1, true);
        testHelper.createCertification("M Cert", "Issuer", 2, true);

        mockMvc.perform(get("/api/public/certifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)))
                .andExpect(jsonPath("$.data[0].name").value("A Cert"))
                .andExpect(jsonPath("$.data[1].name").value("M Cert"))
                .andExpect(jsonPath("$.data[2].name").value("Z Cert"));
    }

    // ===== Contact Endpoint =====

    @Test
    @DisplayName("Contact endpoint returns contact settings")
    void contactEndpointReturnsSettings() throws Exception {
        testHelper.createContactSettings("contact@example.com");

        mockMvc.perform(get("/api/public/contact"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("contact@example.com"));
    }

    @Test
    @DisplayName("Contact endpoint returns 404 when no settings exist")
    void contactEndpointReturns404WhenEmpty() throws Exception {
        mockMvc.perform(get("/api/public/contact"))
                .andExpect(status().isNotFound());
    }

    // ===== Empty List Handling =====

    @Test
    @DisplayName("Experience endpoint returns empty array when no published items")
    void experienceEndpointReturnsEmptyArray() throws Exception {
        // Create only unpublished items
        testHelper.createExperience("Hidden", "Dev", 1, false);

        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    @DisplayName("Projects endpoint returns empty array when no published items")
    void projectsEndpointReturnsEmptyArray() throws Exception {
        testHelper.createProject("Draft", 1, false, false);

        mockMvc.perform(get("/api/public/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

}
