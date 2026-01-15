package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.ExperienceResponse;
import com.sita.portfolio.service.ExperienceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for experience management.
 */
@RestController
@RequestMapping({"/api/admin/experience", "/api/admin/experiences"})
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceService experienceService;

    /**
     * Gets all experiences (including unpublished).
     * GET /api/admin/experiences
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getAllExperiences(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getAllExperiences(), request.getRequestURI()));
    }

    /**
     * Gets an experience by ID.
     * GET /api/admin/experiences/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> getExperience(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.getExperience(id), request.getRequestURI()));
    }

    /**
     * Creates a new experience.
     * POST /api/admin/experiences
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ExperienceResponse>> createExperience(
            @Valid @RequestBody CreateExperienceRequest createRequest,
            HttpServletRequest request) {
        ExperienceResponse created = experienceService.createExperience(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, request.getRequestURI()));
    }

    /**
     * Updates an experience.
     * PUT /api/admin/experiences/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> updateExperience(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExperienceRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.updateExperience(id, updateRequest), request.getRequestURI()));
    }

    /**
     * Deletes an experience.
     * DELETE /api/admin/experiences/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExperience(
            @PathVariable UUID id,
            HttpServletRequest request) {
        experienceService.deleteExperience(id);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

    /**
     * Toggles publish status for an experience.
     * PATCH /api/admin/experience/{id}/publish
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<ExperienceResponse>> setPublished(
            @PathVariable UUID id,
            @Valid @RequestBody PublishRequest publishRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                experienceService.setPublished(id, publishRequest.getPublished()),
                request.getRequestURI()
        ));
    }

    /**
     * Reorders experiences.
     * PUT /api/admin/experience/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> reorderExperiences(
            @Valid @RequestBody ReorderRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(experienceService.reorderExperiences(reorderRequest), request.getRequestURI()));
    }

    /**
     * Adds a bullet to an experience.
     * POST /api/admin/experiences/{id}/bullets
     */
    @PostMapping("/{id}/bullets")
    public ResponseEntity<ApiResponse<ExperienceResponse>> addBullet(
            @PathVariable UUID id,
            @Valid @RequestBody CreateBulletRequest bulletRequest,
            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(experienceService.addBullet(id, bulletRequest), request.getRequestURI()));
    }

    /**
     * Updates a bullet.
     * PUT /api/admin/experiences/{experienceId}/bullets/{bulletId}
     */
    @PutMapping("/{experienceId}/bullets/{bulletId}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> updateBullet(
            @PathVariable UUID experienceId,
            @PathVariable UUID bulletId,
            @Valid @RequestBody UpdateBulletRequest bulletRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                experienceService.updateBullet(experienceId, bulletId, bulletRequest),
                request.getRequestURI()
        ));
    }

    /**
     * Deletes a bullet.
     * DELETE /api/admin/experiences/{experienceId}/bullets/{bulletId}
     */
    @DeleteMapping("/{experienceId}/bullets/{bulletId}")
    public ResponseEntity<ApiResponse<ExperienceResponse>> deleteBullet(
            @PathVariable UUID experienceId,
            @PathVariable UUID bulletId,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                experienceService.deleteBullet(experienceId, bulletId),
                request.getRequestURI()
        ));
    }

}
