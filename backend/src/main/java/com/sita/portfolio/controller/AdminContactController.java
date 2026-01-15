package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.UpdateContactSettingsRequest;
import com.sita.portfolio.model.dto.response.ContactSettingsResponse;
import com.sita.portfolio.service.ContactSettingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller for contact settings management.
 */
@RestController
@RequestMapping("/api/admin/contact")
@RequiredArgsConstructor
public class AdminContactController {

    private final ContactSettingsService contactSettingsService;

    /**
     * Gets the contact settings.
     * GET /api/admin/contact
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> getContactSettings(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contactSettingsService.getContactSettings(), request.getRequestURI()));
    }

    /**
     * Updates the contact settings.
     * PUT /api/admin/contact
     */
    @PutMapping
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> updateContactSettings(
            @Valid @RequestBody UpdateContactSettingsRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contactSettingsService.updateContactSettings(updateRequest), request.getRequestURI()));
    }

}
