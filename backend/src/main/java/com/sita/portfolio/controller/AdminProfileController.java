package com.sita.portfolio.controller;

import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.request.UpdateProfileRequest;
import com.sita.portfolio.model.dto.response.ProfileResponse;
import com.sita.portfolio.service.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Admin controller for profile management.
 */
@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final ProfileService profileService;

    /**
     * Gets the profile.
     * GET /api/admin/profile
     */
    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileService.getProfile(), request.getRequestURI()));
    }

    /**
     * Updates the profile.
     * PUT /api/admin/profile
     */
    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest updateRequest,
            HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(profileService.updateProfile(updateRequest), request.getRequestURI()));
    }

}
