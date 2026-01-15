package com.sita.portfolio.test;

import com.sita.portfolio.model.entity.*;
import com.sita.portfolio.repository.*;
import com.sita.portfolio.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Helper class for creating test data and authentication tokens.
 * Provides factory methods for creating entities and JWT tokens.
 */
@Component
public class TestHelper {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    @Autowired
    private AdminUserRepository adminUserRepository;

    // ===== JWT Token Generation =====

    private static final UUID ADMIN_USER_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
    private static final String ADMIN_EMAIL = "admin@portfolio.local";

    /**
     * Generates a valid admin JWT token for testing protected endpoints.
     */
    public String generateAdminToken() {
        return jwtTokenProvider.generateAccessToken(ADMIN_USER_ID, ADMIN_EMAIL, "ADMIN");
    }

    /**
     * Creates an Authorization header with a valid admin JWT token.
     */
    public HttpHeaders createAdminAuthHeader() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(generateAdminToken());
        return headers;
    }

    /**
     * Returns the Authorization header value for use with MockMvc.
     */
    public String adminBearerToken() {
        return "Bearer " + generateAdminToken();
    }

    // ===== Data Cleanup =====

    /**
     * Clears all test data from the database.
     * Call this in @BeforeEach to ensure test isolation.
     */
    public void clearAllData() {
        experienceRepository.deleteAll();
        projectRepository.deleteAll();
        skillCategoryRepository.deleteAll();
        educationRepository.deleteAll();
        certificationRepository.deleteAll();
        contactSettingsRepository.deleteAll();
        profileRepository.deleteAll();
        // Don't delete admin users - they're seeded by migration
    }

    // ===== Profile Factory =====

    public Profile createProfile(String name, String title) {
        return profileRepository.save(Profile.builder()
                .name(name)
                .title(title)
                .tagline("Test tagline")
                .bio("Test bio")
                .email("test@example.com")
                .build());
    }

    // ===== Experience Factory =====

    public Experience createExperience(String company, String role, int sortOrder, boolean published) {
        return experienceRepository.save(Experience.builder()
                .company(company)
                .role(role)
                .location("Test Location")
                .startDate(LocalDate.of(2020, 1, 1))
                .sortOrder(sortOrder)
                .published(published)
                .build());
    }

    public Experience createExperienceWithBullets(String company, String role, int sortOrder, 
                                                   boolean published, String... bulletContents) {
        Experience experience = Experience.builder()
                .company(company)
                .role(role)
                .location("Test Location")
                .startDate(LocalDate.of(2020, 1, 1))
                .sortOrder(sortOrder)
                .published(published)
                .build();

        int bulletOrder = 1;
        for (String content : bulletContents) {
            ExperienceBullet bullet = ExperienceBullet.builder()
                    .content(content)
                    .sortOrder(bulletOrder++)
                    .build();
            experience.addBullet(bullet);
        }

        return experienceRepository.save(experience);
    }

    // ===== Project Factory =====

    public Project createProject(String title, int sortOrder, boolean published, boolean featured) {
        return projectRepository.save(Project.builder()
                .title(title)
                .slug(title.toLowerCase().replace(" ", "-"))
                .description("Test description for " + title)
                .sortOrder(sortOrder)
                .published(published)
                .featured(featured)
                .build());
    }

    public Project createProjectWithBullets(String title, int sortOrder, boolean published, 
                                            boolean featured, String... bulletContents) {
        Project project = Project.builder()
                .title(title)
                .slug(title.toLowerCase().replace(" ", "-"))
                .description("Test description for " + title)
                .sortOrder(sortOrder)
                .published(published)
                .featured(featured)
                .build();

        int bulletOrder = 1;
        for (String content : bulletContents) {
            ProjectBullet bullet = ProjectBullet.builder()
                    .content(content)
                    .sortOrder(bulletOrder++)
                    .build();
            project.addBullet(bullet);
        }

        return projectRepository.save(project);
    }

    // ===== Skill Factory =====

    public SkillCategory createSkillCategory(String name, int sortOrder, boolean published) {
        return skillCategoryRepository.save(SkillCategory.builder()
                .name(name)
                .icon("test-icon")
                .sortOrder(sortOrder)
                .published(published)
                .build());
    }

    public SkillCategory createSkillCategoryWithItems(String name, int sortOrder, boolean published, 
                                                       String... skillNames) {
        SkillCategory category = SkillCategory.builder()
                .name(name)
                .icon("test-icon")
                .sortOrder(sortOrder)
                .published(published)
                .build();

        int itemOrder = 1;
        for (String skillName : skillNames) {
            SkillItem item = SkillItem.builder()
                    .name(skillName)
                    .proficiency("Expert")
                    .sortOrder(itemOrder++)
                    .build();
            category.addSkill(item);
        }

        return skillCategoryRepository.save(category);
    }

    // ===== Education Factory =====

    public Education createEducation(String institution, String degree, int sortOrder, boolean published) {
        return educationRepository.save(Education.builder()
                .institution(institution)
                .degree(degree)
                .fieldOfStudy("Computer Science")
                .startYear(2015)
                .endYear(2019)
                .sortOrder(sortOrder)
                .published(published)
                .build());
    }

    // ===== Certification Factory =====

    public Certification createCertification(String name, String issuer, int sortOrder, boolean published) {
        return certificationRepository.save(Certification.builder()
                .name(name)
                .issuer(issuer)
                .issueDate(LocalDate.of(2023, 1, 15))
                .sortOrder(sortOrder)
                .published(published)
                .build());
    }

    // ===== Contact Settings Factory =====

    public ContactSettings createContactSettings(String email) {
        return contactSettingsRepository.save(ContactSettings.builder()
                .email(email)
                .phone("+1234567890")
                .location("Test City")
                .formEnabled(true)
                .build());
    }

}
