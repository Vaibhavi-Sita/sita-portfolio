package com.sita.portfolio.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sita.portfolio.model.dto.request.ImportResumeRequest;
import com.sita.portfolio.model.dto.request.ImportResumeRequest.*;
import com.sita.portfolio.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the resume import endpoint.
 * Tests transactional behavior, data replacement, and ordering.
 * 
 * Uses Testcontainers PostgreSQL with Flyway migrations.
 * 
 * NOTE: These tests do NOT use @Transactional at the class level
 * to test actual transaction behavior with real commits.
 */
@Import(TestConfig.class)
class ImportIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestHelper testHelper;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private CertificationRepository certificationRepository;

    @Autowired
    private ContactSettingsRepository contactSettingsRepository;

    @BeforeEach
    void setUp() {
        testHelper.clearAllData();
    }

    @AfterEach
    void tearDown() {
        testHelper.clearAllData();
    }

    // ===== Authentication =====

    @Test
    @DisplayName("Import endpoint requires authentication")
    void importRequiresAuth() throws Exception {
        mockMvc.perform(post("/api/admin/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    // ===== Import Into Empty Database =====

    @Test
    @DisplayName("Import into empty database works")
    void importIntoEmptyDb() throws Exception {
        ImportResumeRequest request = createFullImportRequest();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.success").value(true))
                .andExpect(jsonPath("$.data.counts.experiences").value(2))
                .andExpect(jsonPath("$.data.counts.experienceBullets").value(3))
                .andExpect(jsonPath("$.data.counts.projects").value(2))
                .andExpect(jsonPath("$.data.counts.projectBullets").value(2))
                .andExpect(jsonPath("$.data.counts.skillCategories").value(2))
                .andExpect(jsonPath("$.data.counts.skillItems").value(4))
                .andExpect(jsonPath("$.data.counts.education").value(1))
                .andExpect(jsonPath("$.data.counts.certifications").value(1))
                .andExpect(jsonPath("$.data.counts.profileUpdated").value(true))
                .andExpect(jsonPath("$.data.counts.contactSettingsUpdated").value(true));

        // Verify data was saved
        assertThat(profileRepository.findProfile()).isPresent();
        assertThat(experienceRepository.count()).isEqualTo(2);
        assertThat(projectRepository.count()).isEqualTo(2);
        assertThat(skillCategoryRepository.count()).isEqualTo(2);
        assertThat(educationRepository.count()).isEqualTo(1);
        assertThat(certificationRepository.count()).isEqualTo(1);
        assertThat(contactSettingsRepository.findSettings()).isPresent();
    }

    // ===== Import Overwrites Existing Data =====

    @Test
    @DisplayName("Import overwrites existing lists cleanly")
    void importOverwritesExisting() throws Exception {
        // First import
        ImportResumeRequest firstImport = createFullImportRequest();
        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(firstImport)))
                .andExpect(status().isOk());

        assertThat(experienceRepository.count()).isEqualTo(2);
        assertThat(projectRepository.count()).isEqualTo(2);

        // Second import with different data
        ImportResumeRequest secondImport = ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("New Name")
                        .title("New Title")
                        .build())
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("Only Company")
                                .role("Only Role")
                                .startDate(LocalDate.of(2024, 1, 1))
                                .published(true)
                                .build()
                ))
                .projects(List.of())  // Empty list - should clear all
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(secondImport)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.counts.experiences").value(1))
                .andExpect(jsonPath("$.data.counts.projects").value(0));

        // Verify new state
        assertThat(experienceRepository.count()).isEqualTo(1);
        assertThat(projectRepository.count()).isEqualTo(0);

        var profile = profileRepository.findProfile().orElseThrow();
        assertThat(profile.getName()).isEqualTo("New Name");
    }

    // ===== Sort Order Assignment =====

    @Test
    @DisplayName("Sort order is assigned sequentially starting from 1")
    void sortOrderAssignedSequentially() throws Exception {
        ImportResumeRequest request = ImportResumeRequest.builder()
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("First")
                                .role("Role")
                                .startDate(LocalDate.of(2024, 1, 1))
                                .published(true)
                                .build(),
                        ExperienceImport.builder()
                                .company("Second")
                                .role("Role")
                                .startDate(LocalDate.of(2023, 1, 1))
                                .published(true)
                                .build(),
                        ExperienceImport.builder()
                                .company("Third")
                                .role("Role")
                                .startDate(LocalDate.of(2022, 1, 1))
                                .published(true)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        var experiences = experienceRepository.findByPublishedTrueOrderBySortOrderAsc();
        assertThat(experiences).hasSize(3);
        assertThat(experiences.get(0).getCompany()).isEqualTo("First");
        assertThat(experiences.get(0).getSortOrder()).isEqualTo(1);
        assertThat(experiences.get(1).getCompany()).isEqualTo("Second");
        assertThat(experiences.get(1).getSortOrder()).isEqualTo(2);
        assertThat(experiences.get(2).getCompany()).isEqualTo("Third");
        assertThat(experiences.get(2).getSortOrder()).isEqualTo(3);
    }

    // ===== Public Endpoints Reflect Import =====

    @Test
    @DisplayName("Public endpoints reflect imported content")
    void publicEndpointsReflectImport() throws Exception {
        ImportResumeRequest request = ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("Test User")
                        .title("Test Title")
                        .tagline("Test Tagline")
                        .build())
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("Published Company")
                                .role("Developer")
                                .startDate(LocalDate.of(2024, 1, 1))
                                .published(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("Did something great").build()
                                ))
                                .build(),
                        ExperienceImport.builder()
                                .company("Unpublished Company")
                                .role("Developer")
                                .startDate(LocalDate.of(2023, 1, 1))
                                .published(false)
                                .build()
                ))
                .skillCategories(List.of(
                        SkillCategoryImport.builder()
                                .name("Languages")
                                .published(true)
                                .skills(List.of(
                                        SkillItemImport.builder().name("Java").proficiency("Expert").build(),
                                        SkillItemImport.builder().name("Python").proficiency("Advanced").build()
                                ))
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Verify public profile endpoint
        mockMvc.perform(get("/api/public/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Test User"))
                .andExpect(jsonPath("$.data.title").value("Test Title"));

        // Verify public experience endpoint - only published items
        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].company").value("Published Company"))
                .andExpect(jsonPath("$.data[0].bullets").isArray())
                .andExpect(jsonPath("$.data[0].bullets", hasSize(1)));

        // Verify public skills endpoint
        mockMvc.perform(get("/api/public/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].name").value("Languages"))
                .andExpect(jsonPath("$.data[0].skills", hasSize(2)));
    }

    // ===== Bullet Point Ordering =====

    @Test
    @DisplayName("Bullets are imported with correct order")
    void bulletsImportedWithOrder() throws Exception {
        ImportResumeRequest request = ImportResumeRequest.builder()
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("Company")
                                .role("Role")
                                .startDate(LocalDate.of(2024, 1, 1))
                                .published(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("First bullet").build(),
                                        BulletImport.builder().content("Second bullet").build(),
                                        BulletImport.builder().content("Third bullet").build()
                                ))
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // Verify bullets through API endpoint to avoid LazyInitializationException
        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].bullets", hasSize(3)))
                .andExpect(jsonPath("$.data[0].bullets[0].content").value("First bullet"))
                .andExpect(jsonPath("$.data[0].bullets[1].content").value("Second bullet"))
                .andExpect(jsonPath("$.data[0].bullets[2].content").value("Third bullet"));
    }

    // ===== Validation =====

    @Test
    @DisplayName("Validation errors are returned for invalid data")
    void validationErrors() throws Exception {
        ImportResumeRequest request = ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("")  // Invalid - blank
                        .title("Test Title")
                        .build())
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors").isArray());
    }

    // ===== Auto-Generated Slugs =====

    @Test
    @DisplayName("Project slugs are auto-generated when not provided")
    void projectSlugAutoGenerated() throws Exception {
        ImportResumeRequest request = ImportResumeRequest.builder()
                .projects(List.of(
                        ProjectImport.builder()
                                .title("My Amazing Project!")
                                .published(true)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        var project = projectRepository.findByPublishedTrueOrderBySortOrderAsc().get(0);
        assertThat(project.getSlug()).isEqualTo("my-amazing-project");
    }

    // ===== Partial Import =====

    @Test
    @DisplayName("Partial import only affects provided sections")
    void partialImport() throws Exception {
        // First, import full data
        ImportResumeRequest fullImport = createFullImportRequest();
        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(fullImport)))
                .andExpect(status().isOk());

        long initialExperienceCount = experienceRepository.count();
        long initialProjectCount = projectRepository.count();

        // Now do partial import - only profile
        ImportResumeRequest partialImport = ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("Updated Name")
                        .title("Updated Title")
                        .build())
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(partialImport)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.counts.profileUpdated").value(true));

        // Experiences and projects should remain unchanged
        assertThat(experienceRepository.count()).isEqualTo(initialExperienceCount);
        assertThat(projectRepository.count()).isEqualTo(initialProjectCount);

        // Profile should be updated
        var profile = profileRepository.findProfile().orElseThrow();
        assertThat(profile.getName()).isEqualTo("Updated Name");
    }

    // ===== Transaction Atomicity =====

    @Test
    @DisplayName("Import is atomic - invalid data doesn't partially commit")
    void importIsAtomic() throws Exception {
        // First, create some data
        testHelper.createExperience("Existing", "Dev", 1, true);
        assertThat(experienceRepository.count()).isEqualTo(1);

        // Try to import with invalid nested data
        // Create a request that would clear experiences but has invalid profile
        ImportResumeRequest request = ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("")  // Invalid - will cause validation error
                        .title("Valid Title")
                        .build())
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("New Company")
                                .role("Role")
                                .startDate(LocalDate.of(2024, 1, 1))
                                .published(true)
                                .build()
                ))
                .build();

        mockMvc.perform(post("/api/admin/import")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        // Existing experience should still be there (transaction rolled back)
        assertThat(experienceRepository.count()).isEqualTo(1);
        assertThat(experienceRepository.findAll().get(0).getCompany()).isEqualTo("Existing");
    }

    // ===== Helper Methods =====

    private ImportResumeRequest createFullImportRequest() {
        return ImportResumeRequest.builder()
                .profile(ProfileImport.builder()
                        .name("Test User")
                        .title("Software Engineer")
                        .tagline("Building cool stuff")
                        .bio("Test bio")
                        .email("test@example.com")
                        .build())
                .experiences(List.of(
                        ExperienceImport.builder()
                                .company("Company A")
                                .role("Senior Dev")
                                .startDate(LocalDate.of(2023, 1, 1))
                                .published(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("Bullet 1").build(),
                                        BulletImport.builder().content("Bullet 2").build()
                                ))
                                .build(),
                        ExperienceImport.builder()
                                .company("Company B")
                                .role("Dev")
                                .startDate(LocalDate.of(2021, 1, 1))
                                .endDate(LocalDate.of(2022, 12, 31))
                                .published(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("Bullet 3").build()
                                ))
                                .build()
                ))
                .projects(List.of(
                        ProjectImport.builder()
                                .title("Project A")
                                .description("Description A")
                                .published(true)
                                .featured(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("Feature 1").build()
                                ))
                                .build(),
                        ProjectImport.builder()
                                .title("Project B")
                                .description("Description B")
                                .published(true)
                                .bullets(List.of(
                                        BulletImport.builder().content("Feature 2").build()
                                ))
                                .build()
                ))
                .skillCategories(List.of(
                        SkillCategoryImport.builder()
                                .name("Languages")
                                .published(true)
                                .skills(List.of(
                                        SkillItemImport.builder().name("Java").build(),
                                        SkillItemImport.builder().name("Python").build()
                                ))
                                .build(),
                        SkillCategoryImport.builder()
                                .name("Frameworks")
                                .published(true)
                                .skills(List.of(
                                        SkillItemImport.builder().name("Spring").build(),
                                        SkillItemImport.builder().name("Angular").build()
                                ))
                                .build()
                ))
                .education(List.of(
                        EducationImport.builder()
                                .institution("Test University")
                                .degree("BS")
                                .fieldOfStudy("Computer Science")
                                .startYear(2015)
                                .endYear(2019)
                                .published(true)
                                .build()
                ))
                .certifications(List.of(
                        CertificationImport.builder()
                                .name("AWS Certified")
                                .issuer("Amazon")
                                .issueDate(LocalDate.of(2023, 6, 15))
                                .published(true)
                                .build()
                ))
                .contactSettings(ContactSettingsImport.builder()
                        .email("contact@example.com")
                        .location("San Francisco, CA")
                        .formEnabled(true)
                        .build())
                .build();
    }

}
