package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.ProjectResponse;
import com.sita.portfolio.service.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for project management.
 */
@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectService projectService;

    /**
     * Gets all projects (including unpublished).
     * GET /api/admin/projects
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getAllProjects(), request.getRequestURI()));
    }

    /**
     * Gets a project by ID.
     * GET /api/admin/projects/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(projectService.getProject(id), request.getRequestURI()));
    }

    /**
     * Creates a new project.
     * POST /api/admin/projects
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody CreateProjectRequest createRequest,
            HttpServletRequest request) {
        ProjectResponse created = projectService.createProject(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, request.getRequestURI()));
    }

    /**
     * Updates a project.
     * PUT /api/admin/projects/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(projectService.updateProject(id, updateRequest), request.getRequestURI()));
    }

    /**
     * Deletes a project.
     * DELETE /api/admin/projects/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable UUID id,
            HttpServletRequest request) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

    /**
     * Toggles publish status for a project.
     * PATCH /api/admin/projects/{id}/publish
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<ProjectResponse>> setPublished(
            @PathVariable UUID id,
            @Valid @RequestBody PublishRequest publishRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.setPublished(id, publishRequest.getPublished()),
                request.getRequestURI()
        ));
    }

    /**
     * Reorders projects.
     * PUT /api/admin/projects/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> reorderProjects(
            @Valid @RequestBody ReorderRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(projectService.reorderProjects(reorderRequest), request.getRequestURI()));
    }

    /**
     * Adds a bullet to a project.
     * POST /api/admin/projects/{id}/bullets
     */
    @PostMapping("/{id}/bullets")
    public ResponseEntity<ApiResponse<ProjectResponse>> addBullet(
            @PathVariable UUID id,
            @Valid @RequestBody CreateBulletRequest bulletRequest,
            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(projectService.addBullet(id, bulletRequest), request.getRequestURI()));
    }

    /**
     * Updates a bullet.
     * PUT /api/admin/projects/{projectId}/bullets/{bulletId}
     */
    @PutMapping("/{projectId}/bullets/{bulletId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateBullet(
            @PathVariable UUID projectId,
            @PathVariable UUID bulletId,
            @Valid @RequestBody UpdateBulletRequest bulletRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.updateBullet(projectId, bulletId, bulletRequest),
                request.getRequestURI()
        ));
    }

    /**
     * Deletes a bullet.
     * DELETE /api/admin/projects/{projectId}/bullets/{bulletId}
     */
    @DeleteMapping("/{projectId}/bullets/{bulletId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> deleteBullet(
            @PathVariable UUID projectId,
            @PathVariable UUID bulletId,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                projectService.deleteBullet(projectId, bulletId),
                request.getRequestURI()
        ));
    }

}
