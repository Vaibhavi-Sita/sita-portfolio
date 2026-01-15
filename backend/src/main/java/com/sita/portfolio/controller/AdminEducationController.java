package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.EducationResponse;
import com.sita.portfolio.service.EducationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for education management.
 */
@RestController
@RequestMapping("/api/admin/education")
@RequiredArgsConstructor
public class AdminEducationController {

    private final EducationService educationService;

    /**
     * Gets all education entries (including unpublished).
     * GET /api/admin/education
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getAllEducation(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(educationService.getAllEducation(), request.getRequestURI()));
    }

    /**
     * Gets an education entry by ID.
     * GET /api/admin/education/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationResponse>> getEducation(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(educationService.getEducation(id), request.getRequestURI()));
    }

    /**
     * Creates a new education entry.
     * POST /api/admin/education
     */
    @PostMapping
    public ResponseEntity<ApiResponse<EducationResponse>> createEducation(
            @Valid @RequestBody CreateEducationRequest createRequest,
            HttpServletRequest request) {
        EducationResponse created = educationService.createEducation(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, request.getRequestURI()));
    }

    /**
     * Updates an education entry.
     * PUT /api/admin/education/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EducationResponse>> updateEducation(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateEducationRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(educationService.updateEducation(id, updateRequest), request.getRequestURI()));
    }

    /**
     * Deletes an education entry.
     * DELETE /api/admin/education/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @PathVariable UUID id,
            HttpServletRequest request) {
        educationService.deleteEducation(id);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

    /**
     * Toggles publish status for an education entry.
     * PATCH /api/admin/education/{id}/publish
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<EducationResponse>> setPublished(
            @PathVariable UUID id,
            @Valid @RequestBody PublishRequest publishRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                educationService.setPublished(id, publishRequest.getPublished()),
                request.getRequestURI()
        ));
    }

    /**
     * Reorders education entries.
     * PUT /api/admin/education/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<EducationResponse>>> reorderEducation(
            @Valid @RequestBody ReorderRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(educationService.reorderEducation(reorderRequest), request.getRequestURI()));
    }

}
