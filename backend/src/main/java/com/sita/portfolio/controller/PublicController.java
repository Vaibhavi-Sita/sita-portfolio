package com.sita.portfolio.controller;

import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.ApiResponse;
import com.sita.portfolio.model.dto.HealthResponse;
import com.sita.portfolio.model.dto.request.ContactMessageRequest;
import com.sita.portfolio.model.dto.response.*;
import com.sita.portfolio.service.ContactMessageService;
import com.sita.portfolio.service.HealthService;
import com.sita.portfolio.service.PortfolioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public API endpoints accessible without authentication.
 * All list endpoints return published content only, sorted by sort_order ASC.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final HealthService healthService;
    private final PortfolioService portfolioService;
    private final ContactMessageService contactMessageService;

    /**
     * Health check endpoint.
     * GET /api/public/health
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<HealthResponse>> health(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(healthService.getHealthStatus(), request.getRequestURI()));
    }

    /**
     * Gets all published portfolio data in a single response.
     * GET /api/public/portfolio
     */
    @GetMapping("/portfolio")
    public ResponseEntity<ApiResponse<PortfolioResponse>> getPortfolio(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPortfolio(), request.getRequestURI()));
    }

    /**
     * Gets the profile.
     * GET /api/public/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(HttpServletRequest request) {
        ProfileResponse profile = portfolioService.getProfile();
        if (profile == null) {
            throw new ResourceNotFoundException("Profile not found");
        }
        return ResponseEntity.ok(ApiResponse.success(profile, request.getRequestURI()));
    }

    /**
     * Gets all published experiences sorted by sort_order.
     * GET /api/public/experience or /api/public/experiences
     */
    @GetMapping({"/experience", "/experiences"})
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> getExperiences(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPublishedExperiences(), request.getRequestURI()));
    }

    /**
     * Gets all published projects sorted by sort_order.
     * GET /api/public/projects
     */
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPublishedProjects(), request.getRequestURI()));
    }

    /**
     * Gets all featured and published projects.
     * GET /api/public/projects/featured
     */
    @GetMapping("/projects/featured")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getFeaturedProjects(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getFeaturedProjects(), request.getRequestURI()));
    }

    /**
     * Gets a published project by slug.
     * GET /api/public/projects/{slug}
     */
    @GetMapping("/projects/{slug}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(
            @PathVariable String slug,
            HttpServletRequest request) {
        ProjectResponse project = portfolioService.getProjectBySlug(slug);
        if (project == null) {
            throw new ResourceNotFoundException("Project", "slug", slug);
        }
        return ResponseEntity.ok(ApiResponse.success(project, request.getRequestURI()));
    }

    /**
     * Gets all published skill categories with skills sorted by sort_order.
     * GET /api/public/skills
     */
    @GetMapping("/skills")
    public ResponseEntity<ApiResponse<List<SkillCategoryResponse>>> getSkills(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPublishedSkills(), request.getRequestURI()));
    }

    /**
     * Gets all published education entries sorted by sort_order.
     * GET /api/public/education
     */
    @GetMapping("/education")
    public ResponseEntity<ApiResponse<List<EducationResponse>>> getEducation(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPublishedEducation(), request.getRequestURI()));
    }

    /**
     * Gets all published certifications sorted by sort_order.
     * GET /api/public/certifications
     */
    @GetMapping("/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> getCertifications(HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.success(portfolioService.getPublishedCertifications(), request.getRequestURI()));
    }

    /**
     * Gets the contact settings.
     * GET /api/public/contact
     */
    @GetMapping("/contact")
    public ResponseEntity<ApiResponse<ContactSettingsResponse>> getContactSettings(HttpServletRequest request) {
        ContactSettingsResponse contact = portfolioService.getContactSettings();
        if (contact == null) {
            throw new ResourceNotFoundException("Contact settings not found");
        }
        return ResponseEntity.ok(ApiResponse.success(contact, request.getRequestURI()));
    }

    /**
     * Submit a contact message (public).
     * POST /api/public/contact/messages
     */
    @PostMapping("/contact/messages")
    public ResponseEntity<ApiResponse<Map<String, String>>> submitContactMessage(
            @Valid @RequestBody ContactMessageRequest contactMessageRequest,
            HttpServletRequest request) {
        contactMessageService.submit(contactMessageRequest, request);
        Map<String, String> result = Map.of("status", "received");
        return ResponseEntity.ok(ApiResponse.success(result, request.getRequestURI()));
    }

}
