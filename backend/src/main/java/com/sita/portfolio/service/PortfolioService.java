package com.sita.portfolio.service;

import com.sita.portfolio.model.dto.response.*;
import com.sita.portfolio.repository.*;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for retrieving published portfolio data.
 * All methods return only published content, sorted by sort_order.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PortfolioService {

    private final ProfileRepository profileRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final ContactSettingsRepository contactSettingsRepository;
    private final EntityMapper mapper;

    /**
     * Gets all published portfolio data in a single response.
     */
    public PortfolioResponse getPortfolio() {
        log.debug("Fetching complete portfolio data");

        return PortfolioResponse.builder()
                .profile(getProfile())
                .experiences(getPublishedExperiences())
                .projects(getPublishedProjects())
                .featuredProjects(getFeaturedProjects())
                .skills(getPublishedSkills())
                .education(getPublishedEducation())
                .certifications(getPublishedCertifications())
                .contact(getContactSettings())
                .build();
    }

    /**
     * Gets the profile.
     */
    public ProfileResponse getProfile() {
        return profileRepository.findProfile()
                .map(mapper::toProfileResponse)
                .orElse(null);
    }

    /**
     * Gets all published experiences sorted by sort_order.
     */
    public List<ExperienceResponse> getPublishedExperiences() {
        return mapper.toExperienceResponseList(
                experienceRepository.findByPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets all published projects sorted by sort_order.
     */
    public List<ProjectResponse> getPublishedProjects() {
        return mapper.toProjectResponseList(
                projectRepository.findByPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets all featured and published projects sorted by sort_order.
     */
    public List<ProjectResponse> getFeaturedProjects() {
        return mapper.toProjectResponseList(
                projectRepository.findByFeaturedTrueAndPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets a published project by slug.
     */
    public ProjectResponse getProjectBySlug(String slug) {
        return projectRepository.findBySlugAndPublishedTrue(slug)
                .map(mapper::toProjectResponse)
                .orElse(null);
    }

    /**
     * Gets all published skill categories with their skills, sorted by sort_order.
     */
    public List<SkillCategoryResponse> getPublishedSkills() {
        return mapper.toSkillCategoryResponseList(
                skillCategoryRepository.findByPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets all published education entries sorted by sort_order.
     */
    public List<EducationResponse> getPublishedEducation() {
        return mapper.toEducationResponseList(
                educationRepository.findByPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets all published certifications sorted by sort_order.
     */
    public List<CertificationResponse> getPublishedCertifications() {
        return mapper.toCertificationResponseList(
                certificationRepository.findByPublishedTrueOrderBySortOrderAsc()
        );
    }

    /**
     * Gets the contact settings.
     */
    public ContactSettingsResponse getContactSettings() {
        return contactSettingsRepository.findSettings()
                .map(mapper::toContactSettingsResponse)
                .orElse(null);
    }

}
