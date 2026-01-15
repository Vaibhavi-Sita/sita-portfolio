package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.SkillCategoryResponse;
import com.sita.portfolio.service.SkillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Admin controller for skill management.
 */
@RestController
@RequestMapping({"/api/admin/skills", "/api/admin/skill-categories"})
@RequiredArgsConstructor
public class AdminSkillController {

    private final SkillService skillService;

    /**
     * Gets all skill categories (including unpublished).
     * GET /api/admin/skills
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> getAllCategories(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAllCategories(), request.getRequestURI()));
    }

    /**
     * Gets a skill category by ID.
     * GET /api/admin/skills/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> getCategory(
            @PathVariable UUID id,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.getCategory(id), request.getRequestURI()));
    }

    /**
     * Creates a new skill category.
     * POST /api/admin/skills
     */
    @PostMapping
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> createCategory(
            @Valid @RequestBody CreateSkillCategoryRequest createRequest,
            HttpServletRequest request) {
        SkillCategoryResponse created = skillService.createCategory(createRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, request.getRequestURI()));
    }

    /**
     * Updates a skill category.
     * PUT /api/admin/skills/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSkillCategoryRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.updateCategory(id, updateRequest), request.getRequestURI()));
    }

    /**
     * Deletes a skill category.
     * DELETE /api/admin/skills/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable UUID id,
            HttpServletRequest request) {
        skillService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

    /**
     * Toggles publish status for a skill category.
     * PATCH /api/admin/skill-categories/{id}/publish
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> setCategoryPublished(
            @PathVariable UUID id,
            @Valid @RequestBody PublishRequest publishRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                skillService.setCategoryPublished(id, publishRequest.getPublished()),
                request.getRequestURI()
        ));
    }

    /**
     * Reorders skill categories.
     * PUT /api/admin/skill-categories/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> reorderCategories(
            @Valid @RequestBody ReorderRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.reorderCategories(reorderRequest), request.getRequestURI()));
    }

    /**
     * Reorders skill items within a category.
     * PUT /api/admin/skill-items/reorder
     */
    @PutMapping("/items/reorder")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> reorderSkillItems(
            @Valid @RequestBody ReorderSkillItemsRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.reorderSkillItems(reorderRequest), request.getRequestURI()));
    }

    /**
     * Adds a skill item to a category.
     * POST /api/admin/skills/items
     */
    @PostMapping("/items")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> addSkillItem(
            @Valid @RequestBody CreateSkillItemRequest itemRequest,
            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(skillService.addSkillItem(itemRequest), request.getRequestURI()));
    }

    /**
     * Updates a skill item.
     * PUT /api/admin/skills/items/{itemId}
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> updateSkillItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateSkillItemRequest itemRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(skillService.updateSkillItem(itemId, itemRequest), request.getRequestURI()));
    }

    /**
     * Deletes a skill item.
     * DELETE /api/admin/skills/items/{itemId}
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> deleteSkillItem(
            @PathVariable UUID itemId,
            HttpServletRequest request) {
        skillService.deleteSkillItem(itemId);
        return ResponseEntity.ok(ApiResponse.success(null, request.getRequestURI()));
    }

}
