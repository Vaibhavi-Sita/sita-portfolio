package com.sita.portfolio.test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sita.portfolio.model.dto.request.ReorderRequest;
import com.sita.portfolio.model.entity.*;
import com.sita.portfolio.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for reorder endpoint transactionality.
 * Tests that reorder operations are atomic and handle errors correctly.
 */
@Import(TestConfig.class)
class ReorderTransactionalityTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestHelper testHelper;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SkillCategoryRepository skillCategoryRepository;

    @BeforeEach
    void setUp() {
        testHelper.clearAllData();
    }

    @AfterEach
    void tearDown() {
        testHelper.clearAllData();
    }

    // ===== Experience Reorder =====

    @Test
    @DisplayName("Experience reorder updates all sort orders in single transaction")
    void experienceReorderUpdatesAllSortOrders() throws Exception {
        Experience exp1 = testHelper.createExperience("First", "Dev", 1, true);
        Experience exp2 = testHelper.createExperience("Second", "Dev", 2, true);
        Experience exp3 = testHelper.createExperience("Third", "Dev", 3, true);

        // Reverse the order using list of IDs
        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(exp3.getId(), exp2.getId(), exp1.getId()))
                .build();

        mockMvc.perform(put("/api/admin/experience/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(3)));

        // Verify order persisted - the order should be reversed
        List<Experience> experiences = experienceRepository.findAllByOrderBySortOrderAsc();
        assertThat(experiences.get(0).getCompany()).isEqualTo("Third");
        assertThat(experiences.get(1).getCompany()).isEqualTo("Second");
        assertThat(experiences.get(2).getCompany()).isEqualTo("First");
    }

    @Test
    @DisplayName("Experience reorder fails atomically if any ID is invalid")
    void experienceReorderFailsAtomicallyForInvalidId() throws Exception {
        Experience exp1 = testHelper.createExperience("First", "Dev", 1, true);
        Experience exp2 = testHelper.createExperience("Second", "Dev", 2, true);

        // Include a non-existent ID
        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(exp2.getId(), UUID.randomUUID(), exp1.getId()))
                .build();

        mockMvc.perform(put("/api/admin/experience/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Invalid")));

        // Verify original order preserved (transaction rolled back)
        List<Experience> experiences = experienceRepository.findAllByOrderBySortOrderAsc();
        assertThat(experiences.get(0).getCompany()).isEqualTo("First");
        assertThat(experiences.get(1).getCompany()).isEqualTo("Second");
    }

    @Test
    @DisplayName("Experience reorder persists after database refresh")
    void experienceReorderPersistsAfterRefresh() throws Exception {
        Experience exp1 = testHelper.createExperience("Alpha", "Dev", 1, true);
        Experience exp2 = testHelper.createExperience("Beta", "Dev", 2, true);

        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(exp2.getId(), exp1.getId()))
                .build();

        mockMvc.perform(put("/api/admin/experience/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isOk());

        // Verify public endpoint shows new order
        mockMvc.perform(get("/api/public/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].company").value("Beta"))
                .andExpect(jsonPath("$.data[1].company").value("Alpha"));
    }

    // ===== Project Reorder =====

    @Test
    @DisplayName("Project reorder updates all sort orders")
    void projectReorderUpdatesAllSortOrders() throws Exception {
        Project proj1 = testHelper.createProject("Alpha Project", 1, true, false);
        Project proj2 = testHelper.createProject("Beta Project", 2, true, false);
        Project proj3 = testHelper.createProject("Gamma Project", 3, true, false);

        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(proj3.getId(), proj1.getId(), proj2.getId()))
                .build();

        mockMvc.perform(put("/api/admin/projects/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isOk());

        // Verify order persisted
        List<Project> projects = projectRepository.findAllByOrderBySortOrderAsc();
        assertThat(projects.get(0).getTitle()).isEqualTo("Gamma Project");
        assertThat(projects.get(1).getTitle()).isEqualTo("Alpha Project");
        assertThat(projects.get(2).getTitle()).isEqualTo("Beta Project");
    }

    @Test
    @DisplayName("Project reorder fails atomically for invalid ID")
    void projectReorderFailsAtomicallyForInvalidId() throws Exception {
        Project proj1 = testHelper.createProject("Project A", 1, true, false);
        Project proj2 = testHelper.createProject("Project B", 2, true, false);

        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(UUID.randomUUID(), proj1.getId(), proj2.getId()))
                .build();

        mockMvc.perform(put("/api/admin/projects/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isBadRequest());

        // Original order preserved
        List<Project> projects = projectRepository.findAllByOrderBySortOrderAsc();
        assertThat(projects.get(0).getTitle()).isEqualTo("Project A");
    }

    // ===== Skill Category Reorder =====

    @Test
    @DisplayName("Skill category reorder updates all sort orders")
    void skillCategoryReorderUpdatesAllSortOrders() throws Exception {
        SkillCategory cat1 = testHelper.createSkillCategory("Languages", 1, true);
        SkillCategory cat2 = testHelper.createSkillCategory("Frameworks", 2, true);
        SkillCategory cat3 = testHelper.createSkillCategory("Tools", 3, true);

        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(cat2.getId(), cat3.getId(), cat1.getId()))
                .build();

        mockMvc.perform(put("/api/admin/skill-categories/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isOk());

        List<SkillCategory> categories = skillCategoryRepository.findAllByOrderBySortOrderAsc();
        assertThat(categories.get(0).getName()).isEqualTo("Frameworks");
        assertThat(categories.get(1).getName()).isEqualTo("Tools");
        assertThat(categories.get(2).getName()).isEqualTo("Languages");
    }

    // ===== Edge Cases =====

    @Test
    @DisplayName("Reorder with empty list returns validation error")
    void reorderWithEmptyListReturnsError() throws Exception {
        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of())
                .build();

        mockMvc.perform(put("/api/admin/experience/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Reorder with single item succeeds")
    void reorderWithSingleItemSucceeds() throws Exception {
        Experience exp = testHelper.createExperience("Only One", "Dev", 1, true);

        ReorderRequest reorderRequest = ReorderRequest.builder()
                .orderedIds(List.of(exp.getId()))
                .build();

        mockMvc.perform(put("/api/admin/experience/reorder")
                        .header("Authorization", testHelper.adminBearerToken())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reorderRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

}
