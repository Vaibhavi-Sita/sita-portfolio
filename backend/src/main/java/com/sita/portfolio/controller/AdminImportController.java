package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.ImportResumeRequest;
import com.sita.portfolio.model.dto.response.ImportResultResponse;
import com.sita.portfolio.service.ImportService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller for bulk import operations.
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminImportController {

    private final ImportService importService;

    /**
     * Imports a complete resume, replacing all list content.
     * POST /api/admin/import
     * 
     * This endpoint:
     * - Runs in a single transaction (all or nothing)
     * - Clears and reinserts all list sections
     * - Reassigns sort_order sequentially starting from 1
     * - Upserts profile and contact settings
     */
    @PostMapping("/import")
    public ResponseEntity<ApiResponse<ImportResultResponse>> importResume(
            @Valid @RequestBody ImportResumeRequest importRequest,
            HttpServletRequest request) {
        
        log.info("Received import request");
        
        ImportResultResponse result = importService.importResume(importRequest);
        
        log.info("Import completed: {} experiences, {} projects, {} skill categories, {} education, {} certifications",
                result.getCounts().getExperiences(),
                result.getCounts().getProjects(),
                result.getCounts().getSkillCategories(),
                result.getCounts().getEducation(),
                result.getCounts().getCertifications());
        
        return ResponseEntity.ok(ApiResponse.success(result, request.getRequestURI()));
    }

}
