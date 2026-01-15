package com.sita.portfolio.service.mapper;

import com.sita.portfolio.model.dto.response.*;
import com.sita.portfolio.model.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for converting entities to DTOs.
 * Ensures entities are never returned directly from controllers.
 */
@Component
public class EntityMapper {

    // ========================================
    // Profile
    // ========================================

    public ProfileResponse toProfileResponse(Profile entity) {
        if (entity == null) return null;
        return ProfileResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .title(entity.getTitle())
                .tagline(entity.getTagline())
                .bio(entity.getBio())
                .avatarUrl(entity.getAvatarUrl())
                .resumeUrl(entity.getResumeUrl())
                .email(entity.getEmail())
                .githubUrl(entity.getGithubUrl())
                .linkedinUrl(entity.getLinkedinUrl())
                .twitterUrl(entity.getTwitterUrl())
                .nickname(entity.getNickname())
                .build();
    }

    // ========================================
    // Experience
    // ========================================

    public ExperienceResponse toExperienceResponse(Experience entity) {
        if (entity == null) return null;
        return ExperienceResponse.builder()
                .id(entity.getId())
                .company(entity.getCompany())
                .role(entity.getRole())
                .location(entity.getLocation())
                .employmentType(entity.getEmploymentType())
                .startDate(entity.getStartDate())
                .endDate(entity.getEndDate())
                .description(entity.getDescription())
                .techStack(entity.getTechStack())
                .companyUrl(entity.getCompanyUrl())
                .logoUrl(entity.getLogoUrl())
                .published(entity.isPublished())
                .sortOrder(entity.getSortOrder())
                .bullets(toBulletResponseList(entity.getBullets()))
                .build();
    }

    public List<ExperienceResponse> toExperienceResponseList(List<Experience> entities) {
        return entities.stream()
                .map(this::toExperienceResponse)
                .collect(Collectors.toList());
    }

    private List<ExperienceResponse.BulletResponse> toBulletResponseList(List<ExperienceBullet> bullets) {
        if (bullets == null) return List.of();
        return bullets.stream()
                .map(b -> ExperienceResponse.BulletResponse.builder()
                        .id(b.getId())
                        .content(b.getContent())
                        .sortOrder(b.getSortOrder())
                        .build())
                .collect(Collectors.toList());
    }

    // ========================================
    // Project
    // ========================================

    public ProjectResponse toProjectResponse(Project entity) {
        if (entity == null) return null;
        return ProjectResponse.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .longDescription(entity.getLongDescription())
                .techStack(entity.getTechStack())
                .liveUrl(entity.getLiveUrl())
                .githubUrl(entity.getGithubUrl())
                .imageUrl(entity.getImageUrl())
                .thumbnailUrl(entity.getThumbnailUrl())
                .featured(entity.isFeatured())
                .published(entity.isPublished())
                .sortOrder(entity.getSortOrder())
                .bullets(toProjectBulletResponseList(entity.getBullets()))
                .build();
    }

    public List<ProjectResponse> toProjectResponseList(List<Project> entities) {
        return entities.stream()
                .map(this::toProjectResponse)
                .collect(Collectors.toList());
    }

    private List<ProjectResponse.BulletResponse> toProjectBulletResponseList(List<ProjectBullet> bullets) {
        if (bullets == null) return List.of();
        return bullets.stream()
                .map(b -> ProjectResponse.BulletResponse.builder()
                        .id(b.getId())
                        .content(b.getContent())
                        .sortOrder(b.getSortOrder())
                        .build())
                .collect(Collectors.toList());
    }

    // ========================================
    // Skills
    // ========================================

    public SkillCategoryResponse toSkillCategoryResponse(SkillCategory entity) {
        if (entity == null) return null;
        return SkillCategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .published(entity.isPublished())
                .sortOrder(entity.getSortOrder())
                .skills(toSkillItemResponseList(entity.getSkills()))
                .build();
    }

    public List<SkillCategoryResponse> toSkillCategoryResponseList(List<SkillCategory> entities) {
        return entities.stream()
                .map(this::toSkillCategoryResponse)
                .collect(Collectors.toList());
    }

    private List<SkillCategoryResponse.SkillItemResponse> toSkillItemResponseList(List<SkillItem> items) {
        if (items == null) return List.of();
        return items.stream()
                .map(s -> SkillCategoryResponse.SkillItemResponse.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .iconUrl(s.getIconUrl())
                        .proficiency(s.getProficiency())
                        .sortOrder(s.getSortOrder())
                        .build())
                .collect(Collectors.toList());
    }

    // ========================================
    // Education
    // ========================================

    public EducationResponse toEducationResponse(Education entity) {
        if (entity == null) return null;
        return EducationResponse.builder()
                .id(entity.getId())
                .institution(entity.getInstitution())
                .degree(entity.getDegree())
                .fieldOfStudy(entity.getFieldOfStudy())
                .location(entity.getLocation())
                .startYear(entity.getStartYear())
                .endYear(entity.getEndYear())
                .gpa(entity.getGpa())
                .description(entity.getDescription())
                .logoUrl(entity.getLogoUrl())
                .published(entity.isPublished())
                .sortOrder(entity.getSortOrder())
                .build();
    }

    public List<EducationResponse> toEducationResponseList(List<Education> entities) {
        return entities.stream()
                .map(this::toEducationResponse)
                .collect(Collectors.toList());
    }

    // ========================================
    // Certification
    // ========================================

    public CertificationResponse toCertificationResponse(Certification entity) {
        if (entity == null) return null;
        return CertificationResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .issuer(entity.getIssuer())
                .issueDate(entity.getIssueDate())
                .expiryDate(entity.getExpiryDate())
                .credentialId(entity.getCredentialId())
                .credentialUrl(entity.getCredentialUrl())
                .badgeUrl(entity.getBadgeUrl())
                .published(entity.isPublished())
                .sortOrder(entity.getSortOrder())
                .build();
    }

    public List<CertificationResponse> toCertificationResponseList(List<Certification> entities) {
        return entities.stream()
                .map(this::toCertificationResponse)
                .collect(Collectors.toList());
    }

    // ========================================
    // Contact Settings
    // ========================================

    public ContactSettingsResponse toContactSettingsResponse(ContactSettings entity) {
        if (entity == null) return null;
        return ContactSettingsResponse.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .location(entity.getLocation())
                .availabilityStatus(entity.getAvailabilityStatus())
                .formEnabled(entity.isFormEnabled())
                .formRecipient(entity.getFormRecipient())
                .successMessage(entity.getSuccessMessage())
                .build();
    }

}
