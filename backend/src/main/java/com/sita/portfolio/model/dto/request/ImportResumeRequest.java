package com.sita.portfolio.model.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for importing a complete resume.
 * All list sections will be cleared and replaced with the imported data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResumeRequest {

    @Valid
    private ProfileImport profile;

    @Valid
    private List<ExperienceImport> experiences;

    @Valid
    private List<ProjectImport> projects;

    @Valid
    private List<SkillCategoryImport> skillCategories;

    @Valid
    private List<EducationImport> education;

    @Valid
    private List<CertificationImport> certifications;

    @Valid
    private ContactSettingsImport contactSettings;

    // ========================================
    // Nested Import DTOs
    // ========================================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileImport {
        @NotBlank(message = "Name is required")
        @Size(max = 100)
        private String name;

        @NotBlank(message = "Title is required")
        @Size(max = 150)
        private String title;

        @Size(max = 300)
        private String tagline;

        private String bio;

        @Size(max = 500)
        private String avatarUrl;

        @Size(max = 500)
        private String resumeUrl;

        @Email
        @Size(max = 255)
        private String email;

        @Size(max = 500)
        private String githubUrl;

        @Size(max = 500)
        private String linkedinUrl;

        @Size(max = 500)
        private String twitterUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExperienceImport {
        @NotBlank(message = "Company is required")
        @Size(max = 150)
        private String company;

        @NotBlank(message = "Role is required")
        @Size(max = 150)
        private String role;

        @Size(max = 150)
        private String location;

        @Size(max = 50)
        private String employmentType;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        private LocalDate endDate;

        private String description;

        @Size(max = 500)
        private String techStack;

        @Size(max = 500)
        private String companyUrl;

        @Size(max = 500)
        private String logoUrl;

        @Builder.Default
        private boolean published = true;

        @Valid
        private List<BulletImport> bullets;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectImport {
        @NotBlank(message = "Title is required")
        @Size(max = 150)
        private String title;

        @Size(max = 150)
        private String slug;

        private String description;

        private String longDescription;

        @Size(max = 500)
        private String techStack;

        @Size(max = 500)
        private String liveUrl;

        @Size(max = 500)
        private String githubUrl;

        @Size(max = 500)
        private String imageUrl;

        @Size(max = 500)
        private String thumbnailUrl;

        @Builder.Default
        private boolean featured = false;

        @Builder.Default
        private boolean published = true;

        @Valid
        private List<BulletImport> bullets;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulletImport {
        @NotBlank(message = "Content is required")
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillCategoryImport {
        @NotBlank(message = "Name is required")
        @Size(max = 100)
        private String name;

        @Size(max = 50)
        private String icon;

        @Builder.Default
        private boolean published = true;

        @Valid
        private List<SkillItemImport> skills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillItemImport {
        @NotBlank(message = "Name is required")
        @Size(max = 100)
        private String name;

        @Size(max = 500)
        private String iconUrl;

        @Size(max = 50)
        private String proficiency;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationImport {
        @NotBlank(message = "Institution is required")
        @Size(max = 200)
        private String institution;

        @NotBlank(message = "Degree is required")
        @Size(max = 200)
        private String degree;

        @Size(max = 200)
        private String fieldOfStudy;

        @Size(max = 150)
        private String location;

        @NotNull(message = "Start year is required")
        private Integer startYear;

        private Integer endYear;

        @Size(max = 20)
        private String gpa;

        private String description;

        @Size(max = 500)
        private String logoUrl;

        @Builder.Default
        private boolean published = true;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationImport {
        @NotBlank(message = "Name is required")
        @Size(max = 200)
        private String name;

        @NotBlank(message = "Issuer is required")
        @Size(max = 200)
        private String issuer;

        @NotNull(message = "Issue date is required")
        private LocalDate issueDate;

        private LocalDate expiryDate;

        @Size(max = 200)
        private String credentialId;

        @Size(max = 500)
        private String credentialUrl;

        @Size(max = 500)
        private String badgeUrl;

        @Builder.Default
        private boolean published = true;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContactSettingsImport {
        @NotBlank(message = "Email is required")
        @Email
        @Size(max = 255)
        private String email;

        @Size(max = 50)
        private String phone;

        @Size(max = 200)
        private String location;

        @Size(max = 100)
        private String availabilityStatus;

        @Builder.Default
        private boolean formEnabled = true;

        @Email
        @Size(max = 255)
        private String formRecipient;

        @Size(max = 500)
        private String successMessage;
    }

}
