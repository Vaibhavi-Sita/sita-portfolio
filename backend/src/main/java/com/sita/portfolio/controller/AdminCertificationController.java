package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.CertificationResponse;
import com.sita.portfolio.service.CertificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for certification management.
 */
@RestController
@RequestMapping("/api/admin/certifications")
@RequiredArgsConstructor
public class AdminCertificationController {

    private final CertificationService certificationService;

    /**
     * Gets all certifications (including unpublished).
     * GET /api/admin/certifications
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getAllCertifications(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getAllCertifications(), request.getRequestURI()));
    }

    /**
     * Gets a certification by ID.
     * GET /api/admin/certifications/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> getCertification(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.getCertification(id), request.getRequestURI()));
    }

    /**
     * Creates a new certification.
     * POST /api/admin/certifications
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CertificationResponse>> createCertification(
            @Valid @RequestBody CreateCertificationRequest createRequest,
            HttpServletRequest request) {
        CertificationResponse created = certificationService.createCertification(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, request.getRequestURI()));
    }

    /**
     * Updates a certification.
     * PUT /api/admin/certifications/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> updateCertification(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCertificationRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.updateCertification(id, updateRequest), request.getRequestURI()));
    }

    /**
     * Deletes a certification.
     * DELETE /api/admin/certifications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @PathVariable UUID id,
            HttpServletRequest request) {
        certificationService.deleteCertification(id);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

    /**
     * Toggles publish status for a certification.
     * PATCH /api/admin/certifications/{id}/publish
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<CertificationResponse>> setPublished(
            @PathVariable UUID id,
            @Valid @RequestBody PublishRequest publishRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                certificationService.setPublished(id, publishRequest.getPublished()),
                request.getRequestURI()
        ));
    }

    /**
     * Reorders certifications.
     * PUT /api/admin/certifications/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> reorderCertifications(
            @Valid @RequestBody ReorderRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(certificationService.reorderCertifications(reorderRequest), request.getRequestURI()));
    }

}
