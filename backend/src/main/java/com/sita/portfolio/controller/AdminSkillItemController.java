package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.ReorderSkillItemsRequest;
import com.sita.portfolio.model.dto.response.SkillCategoryResponse;
import com.sita.portfolio.service.SkillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller for skill item operations.
 * Provides the /api/admin/skill-items/reorder endpoint.
 */
@RestController
@RequestMapping("/api/admin/skill-items")
@RequiredArgsConstructor
public class AdminSkillItemController {

    private final SkillService skillService;

    /**
     * Reorders skill items within a category.
     * PUT /api/admin/skill-items/reorder
     */
    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<SkillCategoryResponse>> reorderSkillItems(
            @Valid @RequestBody ReorderSkillItemsRequest reorderRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                skillService.reorderSkillItems(reorderRequest),
                request.getRequestURI()
        ));
    }

}
