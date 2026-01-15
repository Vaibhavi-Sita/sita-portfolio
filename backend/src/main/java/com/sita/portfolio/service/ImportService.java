package com.sita.portfolio.service;

import com.sita.portfolio.model.dto.request.ImportResumeRequest;
import com.sita.portfolio.model.dto.request.ImportResumeRequest.*;
import com.sita.portfolio.model.dto.response.ImportResultResponse;
import com.sita.portfolio.model.dto.response.ImportResultResponse.ImportCounts;
import com.sita.portfolio.model.entity.*;
import com.sita.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service for importing complete resume data.
 * Handles bulk import in a single transaction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ImportService {

    private final ProfileRepository profileRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final SkillCategoryRepository skillCategoryRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final ContactSettingsRepository contactSettingsRepository;

    /**
     * Imports a complete resume, clearing and replacing list sections.
     * Runs in a single transaction - all or nothing.
     */
    @Transactional
    public ImportResultResponse importResume(ImportResumeRequest request) {
        log.info("Starting resume import...");

        ImportCounts.ImportCountsBuilder countsBuilder = ImportCounts.builder();

        // Import profile (upsert)
        if (request.getProfile() != null) {
            importProfile(request.getProfile());
            countsBuilder.profileUpdated(true);
            log.info("Imported profile");
        }

        // Clear and import experiences
        if (request.getExperiences() != null) {
            experienceRepository.deleteAll();
            int[] expCounts = importExperiences(request.getExperiences());
            countsBuilder.experiences(expCounts[0]);
            countsBuilder.experienceBullets(expCounts[1]);
            log.info("Imported {} experiences with {} bullets", expCounts[0], expCounts[1]);
        }

        // Clear and import projects
        if (request.getProjects() != null) {
            projectRepository.deleteAll();
            int[] projCounts = importProjects(request.getProjects());
            countsBuilder.projects(projCounts[0]);
            countsBuilder.projectBullets(projCounts[1]);
            log.info("Imported {} projects with {} bullets", projCounts[0], projCounts[1]);
        }

        // Clear and import skill categories
        if (request.getSkillCategories() != null) {
            skillCategoryRepository.deleteAll();
            int[] skillCounts = importSkillCategories(request.getSkillCategories());
            countsBuilder.skillCategories(skillCounts[0]);
            countsBuilder.skillItems(skillCounts[1]);
            log.info("Imported {} skill categories with {} items", skillCounts[0], skillCounts[1]);
        }

        // Clear and import education
        if (request.getEducation() != null) {
            educationRepository.deleteAll();
            int eduCount = importEducation(request.getEducation());
            countsBuilder.education(eduCount);
            log.info("Imported {} education entries", eduCount);
        }

        // Clear and import certifications
        if (request.getCertifications() != null) {
            certificationRepository.deleteAll();
            int certCount = importCertifications(request.getCertifications());
            countsBuilder.certifications(certCount);
            log.info("Imported {} certifications", certCount);
        }

        // Import contact settings (upsert)
        if (request.getContactSettings() != null) {
            importContactSettings(request.getContactSettings());
            countsBuilder.contactSettingsUpdated(true);
            log.info("Imported contact settings");
        }

        log.info("Resume import completed successfully");
        return ImportResultResponse.success(countsBuilder.build());
    }

    private void importProfile(ProfileImport profileImport) {
        Profile profile = profileRepository.findProfile()
                .orElseGet(Profile::new);

        profile.setName(profileImport.getName());
        profile.setTitle(profileImport.getTitle());
        profile.setTagline(profileImport.getTagline());
        profile.setBio(profileImport.getBio());
        profile.setAvatarUrl(profileImport.getAvatarUrl());
        profile.setResumeUrl(profileImport.getResumeUrl());
        profile.setEmail(profileImport.getEmail());
        profile.setGithubUrl(profileImport.getGithubUrl());
        profile.setLinkedinUrl(profileImport.getLinkedinUrl());
        profile.setTwitterUrl(profileImport.getTwitterUrl());

        profileRepository.save(profile);
    }

    private int[] importExperiences(List<ExperienceImport> imports) {
        int bulletCount = 0;
        int sortOrder = 1;

        for (ExperienceImport exp : imports) {
            Experience experience = Experience.builder()
                    .company(exp.getCompany())
                    .role(exp.getRole())
                    .location(exp.getLocation())
                    .employmentType(exp.getEmploymentType())
                    .startDate(exp.getStartDate())
                    .endDate(exp.getEndDate())
                    .description(exp.getDescription())
                    .techStack(exp.getTechStack())
                    .companyUrl(exp.getCompanyUrl())
                    .logoUrl(exp.getLogoUrl())
                    .published(exp.isPublished())
                    .sortOrder(sortOrder++)
                    .build();

            if (exp.getBullets() != null) {
                int bulletSortOrder = 1;
                for (BulletImport bullet : exp.getBullets()) {
                    ExperienceBullet expBullet = ExperienceBullet.builder()
                            .content(bullet.getContent())
                            .sortOrder(bulletSortOrder++)
                            .build();
                    experience.addBullet(expBullet);
                    bulletCount++;
                }
            }

            experienceRepository.save(experience);
        }

        return new int[]{imports.size(), bulletCount};
    }

    private int[] importProjects(List<ProjectImport> imports) {
        int bulletCount = 0;
        int sortOrder = 1;

        for (ProjectImport proj : imports) {
            Project project = Project.builder()
                    .title(proj.getTitle())
                    .slug(proj.getSlug() != null ? proj.getSlug() : generateSlug(proj.getTitle()))
                    .description(proj.getDescription())
                    .longDescription(proj.getLongDescription())
                    .techStack(proj.getTechStack())
                    .liveUrl(proj.getLiveUrl())
                    .githubUrl(proj.getGithubUrl())
                    .imageUrl(proj.getImageUrl())
                    .thumbnailUrl(proj.getThumbnailUrl())
                    .featured(proj.isFeatured())
                    .published(proj.isPublished())
                    .sortOrder(sortOrder++)
                    .build();

            if (proj.getBullets() != null) {
                int bulletSortOrder = 1;
                for (BulletImport bullet : proj.getBullets()) {
                    ProjectBullet projBullet = ProjectBullet.builder()
                            .content(bullet.getContent())
                            .sortOrder(bulletSortOrder++)
                            .build();
                    project.addBullet(projBullet);
                    bulletCount++;
                }
            }

            projectRepository.save(project);
        }

        return new int[]{imports.size(), bulletCount};
    }

    private int[] importSkillCategories(List<SkillCategoryImport> imports) {
        int itemCount = 0;
        int sortOrder = 1;

        for (SkillCategoryImport cat : imports) {
            SkillCategory category = SkillCategory.builder()
                    .name(cat.getName())
                    .icon(cat.getIcon())
                    .published(cat.isPublished())
                    .sortOrder(sortOrder++)
                    .build();

            if (cat.getSkills() != null) {
                int itemSortOrder = 1;
                for (SkillItemImport skill : cat.getSkills()) {
                    SkillItem item = SkillItem.builder()
                            .name(skill.getName())
                            .iconUrl(skill.getIconUrl())
                            .proficiency(skill.getProficiency())
                            .sortOrder(itemSortOrder++)
                            .build();
                    category.addSkill(item);
                    itemCount++;
                }
            }

            skillCategoryRepository.save(category);
        }

        return new int[]{imports.size(), itemCount};
    }

    private int importEducation(List<EducationImport> imports) {
        int sortOrder = 1;

        for (EducationImport edu : imports) {
            Education education = Education.builder()
                    .institution(edu.getInstitution())
                    .degree(edu.getDegree())
                    .fieldOfStudy(edu.getFieldOfStudy())
                    .location(edu.getLocation())
                    .startYear(edu.getStartYear())
                    .endYear(edu.getEndYear())
                    .gpa(edu.getGpa())
                    .description(edu.getDescription())
                    .logoUrl(edu.getLogoUrl())
                    .published(edu.isPublished())
                    .sortOrder(sortOrder++)
                    .build();

            educationRepository.save(education);
        }

        return imports.size();
    }

    private int importCertifications(List<CertificationImport> imports) {
        int sortOrder = 1;

        for (CertificationImport cert : imports) {
            Certification certification = Certification.builder()
                    .name(cert.getName())
                    .issuer(cert.getIssuer())
                    .issueDate(cert.getIssueDate())
                    .expiryDate(cert.getExpiryDate())
                    .credentialId(cert.getCredentialId())
                    .credentialUrl(cert.getCredentialUrl())
                    .badgeUrl(cert.getBadgeUrl())
                    .published(cert.isPublished())
                    .sortOrder(sortOrder++)
                    .build();

            certificationRepository.save(certification);
        }

        return imports.size();
    }

    private void importContactSettings(ContactSettingsImport settingsImport) {
        ContactSettings settings = contactSettingsRepository.findSettings()
                .orElseGet(ContactSettings::new);

        settings.setEmail(settingsImport.getEmail());
        settings.setPhone(settingsImport.getPhone());
        settings.setLocation(settingsImport.getLocation());
        settings.setAvailabilityStatus(settingsImport.getAvailabilityStatus());
        settings.setFormEnabled(settingsImport.isFormEnabled());
        settings.setFormRecipient(settingsImport.getFormRecipient());
        settings.setSuccessMessage(settingsImport.getSuccessMessage());

        contactSettingsRepository.save(settings);
    }

    private String generateSlug(String title) {
        if (title == null) return null;
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

}
