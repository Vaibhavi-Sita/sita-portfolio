package com.sita.portfolio.service;

import com.sita.portfolio.exception.BadRequestException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.ExperienceResponse;
import com.sita.portfolio.model.entity.Experience;
import com.sita.portfolio.model.entity.ExperienceBullet;
import com.sita.portfolio.repository.ExperienceBulletRepository;
import com.sita.portfolio.repository.ExperienceRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for experience management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ExperienceBulletRepository bulletRepository;
    private final EntityMapper mapper;

    /**
     * Gets all experiences (admin view - includes unpublished).
     */
    @Transactional(readOnly = true)
    public List<ExperienceResponse> getAllExperiences() {
        return mapper.toExperienceResponseList(
                experienceRepository.findAllByOrderBySortOrderAsc()
        );
    }

    /**
     * Gets an experience by ID.
     */
    @Transactional(readOnly = true)
    public ExperienceResponse getExperience(UUID id) {
        return experienceRepository.findById(id)
                .map(mapper::toExperienceResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));
    }

    /**
     * Creates a new experience.
     */
    @Transactional
    public ExperienceResponse createExperience(CreateExperienceRequest request) {
        int maxSortOrder = experienceRepository.findMaxSortOrder();

        Experience experience = Experience.builder()
                .company(request.getCompany())
                .role(request.getRole())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .description(request.getDescription())
                .techStack(request.getTechStack())
                .companyUrl(request.getCompanyUrl())
                .logoUrl(request.getLogoUrl())
                .published(request.isPublished())
                .sortOrder(maxSortOrder + 1)
                .build();

        Experience saved = experienceRepository.save(experience);
        log.info("Created experience: {} at {}", saved.getRole(), saved.getCompany());

        return mapper.toExperienceResponse(saved);
    }

    /**
     * Updates an existing experience.
     */
    @Transactional
    public ExperienceResponse updateExperience(UUID id, UpdateExperienceRequest request) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        if (request.getCompany() != null) experience.setCompany(request.getCompany());
        if (request.getRole() != null) experience.setRole(request.getRole());
        if (request.getLocation() != null) experience.setLocation(request.getLocation());
        if (request.getEmploymentType() != null) experience.setEmploymentType(request.getEmploymentType());
        if (request.getStartDate() != null) experience.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) experience.setEndDate(request.getEndDate());
        if (request.getDescription() != null) experience.setDescription(request.getDescription());
        if (request.getTechStack() != null) experience.setTechStack(request.getTechStack());
        if (request.getCompanyUrl() != null) experience.setCompanyUrl(request.getCompanyUrl());
        if (request.getLogoUrl() != null) experience.setLogoUrl(request.getLogoUrl());
        if (request.getPublished() != null) experience.setPublished(request.getPublished());
        if (request.getSortOrder() != null) experience.setSortOrder(request.getSortOrder());

        Experience saved = experienceRepository.save(experience);
        log.info("Updated experience: {}", id);

        return mapper.toExperienceResponse(saved);
    }

    /**
     * Deletes an experience.
     */
    @Transactional
    public void deleteExperience(UUID id) {
        if (!experienceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Experience", "id", id);
        }
        experienceRepository.deleteById(id);
        log.info("Deleted experience: {}", id);
    }

    /**
     * Toggles the publish status of an experience.
     */
    @Transactional
    public ExperienceResponse setPublished(UUID id, boolean published) {
        Experience experience = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", id));

        experience.setPublished(published);
        Experience saved = experienceRepository.save(experience);

        log.info("Set experience {} published={}", id, published);
        return mapper.toExperienceResponse(saved);
    }

    /**
     * Reorders experiences.
     * Validates all IDs exist before updating.
     */
    @Transactional
    public List<ExperienceResponse> reorderExperiences(ReorderRequest request) {
        List<UUID> orderedIds = request.getOrderedIds();
        
        // Validate all IDs exist
        List<Experience> experiences = experienceRepository.findAllById(orderedIds);
        if (experiences.size() != orderedIds.size()) {
            List<UUID> foundIds = experiences.stream().map(Experience::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid experience IDs: " + missingIds,
                    "orderedIds"
            );
        }
        
        // Update sort orders in a single transaction
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID targetId = orderedIds.get(i);
            int newSortOrder = i;
            experiences.stream()
                    .filter(exp -> exp.getId().equals(targetId))
                    .findFirst()
                    .ifPresent(exp -> exp.setSortOrder(newSortOrder));
        }
        experienceRepository.saveAll(experiences);
        
        log.info("Reordered {} experiences", orderedIds.size());
        return getAllExperiences();
    }

    /**
     * Adds a bullet to an experience.
     */
    @Transactional
    public ExperienceResponse addBullet(UUID experienceId, CreateBulletRequest request) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", experienceId));

        int maxSortOrder = bulletRepository.findMaxSortOrderByExperienceId(experienceId);

        ExperienceBullet bullet = ExperienceBullet.builder()
                .content(request.getContent())
                .sortOrder(maxSortOrder + 1)
                .build();

        experience.addBullet(bullet);
        Experience saved = experienceRepository.save(experience);

        log.info("Added bullet to experience: {}", experienceId);
        return mapper.toExperienceResponse(saved);
    }

    /**
     * Updates a bullet.
     */
    @Transactional
    public ExperienceResponse updateBullet(UUID experienceId, UUID bulletId, UpdateBulletRequest request) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", experienceId));

        ExperienceBullet bullet = bulletRepository.findById(bulletId)
                .orElseThrow(() -> new ResourceNotFoundException("Bullet", "id", bulletId));

        if (request.getContent() != null) bullet.setContent(request.getContent());
        if (request.getSortOrder() != null) bullet.setSortOrder(request.getSortOrder());

        bulletRepository.save(bullet);
        log.info("Updated bullet: {} in experience: {}", bulletId, experienceId);

        return mapper.toExperienceResponse(experience);
    }

    /**
     * Deletes a bullet.
     */
    @Transactional
    public ExperienceResponse deleteBullet(UUID experienceId, UUID bulletId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new ResourceNotFoundException("Experience", "id", experienceId));

        ExperienceBullet bullet = bulletRepository.findById(bulletId)
                .orElseThrow(() -> new ResourceNotFoundException("Bullet", "id", bulletId));

        experience.removeBullet(bullet);
        experienceRepository.save(experience);

        log.info("Deleted bullet: {} from experience: {}", bulletId, experienceId);
        return mapper.toExperienceResponse(experience);
    }

}
