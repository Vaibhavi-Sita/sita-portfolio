package com.sita.portfolio.service;

import com.sita.portfolio.exception.BadRequestException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.ProjectResponse;
import com.sita.portfolio.model.entity.Project;
import com.sita.portfolio.model.entity.ProjectBullet;
import com.sita.portfolio.repository.ProjectBulletRepository;
import com.sita.portfolio.repository.ProjectRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for project management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectBulletRepository bulletRepository;
    private final EntityMapper mapper;

    /**
     * Gets all projects (admin view - includes unpublished).
     */
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return mapper.toProjectResponseList(
                projectRepository.findAllByOrderBySortOrderAsc()
        );
    }

    /**
     * Gets a project by ID.
     */
    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID id) {
        return projectRepository.findById(id)
                .map(mapper::toProjectResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
    }

    /**
     * Creates a new project.
     */
    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        // Check slug uniqueness
        if (request.getSlug() != null && projectRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug already exists", "slug");
        }

        int maxSortOrder = projectRepository.findMaxSortOrder();

        Project project = Project.builder()
                .title(request.getTitle())
                .slug(request.getSlug())
                .description(request.getDescription())
                .longDescription(request.getLongDescription())
                .techStack(request.getTechStack())
                .liveUrl(request.getLiveUrl())
                .githubUrl(request.getGithubUrl())
                .imageUrl(request.getImageUrl())
                .featured(request.isFeatured())
                .published(request.isPublished())
                .sortOrder(maxSortOrder + 1)
                .build();

        Project saved = projectRepository.save(project);
        log.info("Created project: {}", saved.getTitle());

        return mapper.toProjectResponse(saved);
    }

    /**
     * Updates an existing project.
     */
    @Transactional
    public ProjectResponse updateProject(UUID id, UpdateProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        // Check slug uniqueness if changing
        if (request.getSlug() != null && !request.getSlug().equals(project.getSlug())) {
            if (projectRepository.existsBySlug(request.getSlug())) {
                throw new BadRequestException("Slug already exists", "slug");
            }
        }

        if (request.getTitle() != null) project.setTitle(request.getTitle());
        if (request.getSlug() != null) project.setSlug(request.getSlug());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getLongDescription() != null) project.setLongDescription(request.getLongDescription());
        if (request.getTechStack() != null) project.setTechStack(request.getTechStack());
        if (request.getLiveUrl() != null) project.setLiveUrl(request.getLiveUrl());
        if (request.getGithubUrl() != null) project.setGithubUrl(request.getGithubUrl());
        if (request.getImageUrl() != null) project.setImageUrl(request.getImageUrl());
        if (request.getFeatured() != null) project.setFeatured(request.getFeatured());
        if (request.getPublished() != null) project.setPublished(request.getPublished());
        if (request.getSortOrder() != null) project.setSortOrder(request.getSortOrder());

        Project saved = projectRepository.save(project);
        log.info("Updated project: {}", id);

        return mapper.toProjectResponse(saved);
    }

    /**
     * Deletes a project.
     */
    @Transactional
    public void deleteProject(UUID id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
        log.info("Deleted project: {}", id);
    }

    /**
     * Toggles the publish status of a project.
     */
    @Transactional
    public ProjectResponse setPublished(UUID id, boolean published) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        project.setPublished(published);
        Project saved = projectRepository.save(project);

        log.info("Set project {} published={}", id, published);
        return mapper.toProjectResponse(saved);
    }

    /**
     * Reorders projects.
     * Validates all IDs exist before updating.
     */
    @Transactional
    public List<ProjectResponse> reorderProjects(ReorderRequest request) {
        List<UUID> orderedIds = request.getOrderedIds();
        
        // Validate all IDs exist
        List<Project> projects = projectRepository.findAllById(orderedIds);
        if (projects.size() != orderedIds.size()) {
            List<UUID> foundIds = projects.stream().map(Project::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid project IDs: " + missingIds,
                    "orderedIds"
            );
        }
        
        // Update sort orders in a single transaction
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID targetId = orderedIds.get(i);
            int newSortOrder = i;
            projects.stream()
                    .filter(proj -> proj.getId().equals(targetId))
                    .findFirst()
                    .ifPresent(proj -> proj.setSortOrder(newSortOrder));
        }
        projectRepository.saveAll(projects);
        
        log.info("Reordered {} projects", orderedIds.size());
        return getAllProjects();
    }

    /**
     * Adds a bullet to a project.
     */
    @Transactional
    public ProjectResponse addBullet(UUID projectId, CreateBulletRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        int maxSortOrder = bulletRepository.findMaxSortOrderByProjectId(projectId);

        ProjectBullet bullet = ProjectBullet.builder()
                .content(request.getContent())
                .sortOrder(maxSortOrder + 1)
                .build();

        project.addBullet(bullet);
        Project saved = projectRepository.save(project);

        log.info("Added bullet to project: {}", projectId);
        return mapper.toProjectResponse(saved);
    }

    /**
     * Updates a bullet.
     */
    @Transactional
    public ProjectResponse updateBullet(UUID projectId, UUID bulletId, UpdateBulletRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        ProjectBullet bullet = bulletRepository.findById(bulletId)
                .orElseThrow(() -> new ResourceNotFoundException("Bullet", "id", bulletId));

        if (request.getContent() != null) bullet.setContent(request.getContent());
        if (request.getSortOrder() != null) bullet.setSortOrder(request.getSortOrder());

        bulletRepository.save(bullet);
        log.info("Updated bullet: {} in project: {}", bulletId, projectId);

        return mapper.toProjectResponse(project);
    }

    /**
     * Deletes a bullet.
     */
    @Transactional
    public ProjectResponse deleteBullet(UUID projectId, UUID bulletId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        ProjectBullet bullet = bulletRepository.findById(bulletId)
                .orElseThrow(() -> new ResourceNotFoundException("Bullet", "id", bulletId));

        project.removeBullet(bullet);
        projectRepository.save(project);

        log.info("Deleted bullet: {} from project: {}", bulletId, projectId);
        return mapper.toProjectResponse(project);
    }

}
