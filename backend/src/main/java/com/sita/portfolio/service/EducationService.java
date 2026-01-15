package com.sita.portfolio.service;

import com.sita.portfolio.exception.BadRequestException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.EducationResponse;
import com.sita.portfolio.model.entity.Education;
import com.sita.portfolio.repository.EducationRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for education management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EducationService {

    private final EducationRepository educationRepository;
    private final EntityMapper mapper;

    /**
     * Gets all education entries (admin view - includes unpublished).
     */
    @Transactional(readOnly = true)
    public List<EducationResponse> getAllEducation() {
        return mapper.toEducationResponseList(
                educationRepository.findAllByOrderBySortOrderAsc()
        );
    }

    /**
     * Gets an education entry by ID.
     */
    @Transactional(readOnly = true)
    public EducationResponse getEducation(UUID id) {
        return educationRepository.findById(id)
                .map(mapper::toEducationResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));
    }

    /**
     * Creates a new education entry.
     */
    @Transactional
    public EducationResponse createEducation(CreateEducationRequest request) {
        int maxSortOrder = educationRepository.findMaxSortOrder();

        Education education = Education.builder()
                .institution(request.getInstitution())
                .degree(request.getDegree())
                .fieldOfStudy(request.getFieldOfStudy())
                .location(request.getLocation())
                .startYear(request.getStartYear())
                .endYear(request.getEndYear())
                .gpa(request.getGpa())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .published(request.isPublished())
                .sortOrder(maxSortOrder + 1)
                .build();

        Education saved = educationRepository.save(education);
        log.info("Created education: {} at {}", saved.getDegree(), saved.getInstitution());

        return mapper.toEducationResponse(saved);
    }

    /**
     * Updates an existing education entry.
     */
    @Transactional
    public EducationResponse updateEducation(UUID id, UpdateEducationRequest request) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));

        if (request.getInstitution() != null) education.setInstitution(request.getInstitution());
        if (request.getDegree() != null) education.setDegree(request.getDegree());
        if (request.getFieldOfStudy() != null) education.setFieldOfStudy(request.getFieldOfStudy());
        if (request.getLocation() != null) education.setLocation(request.getLocation());
        if (request.getStartYear() != null) education.setStartYear(request.getStartYear());
        if (request.getEndYear() != null) education.setEndYear(request.getEndYear());
        if (request.getGpa() != null) education.setGpa(request.getGpa());
        if (request.getDescription() != null) education.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) education.setLogoUrl(request.getLogoUrl());
        if (request.getPublished() != null) education.setPublished(request.getPublished());
        if (request.getSortOrder() != null) education.setSortOrder(request.getSortOrder());

        Education saved = educationRepository.save(education);
        log.info("Updated education: {}", id);

        return mapper.toEducationResponse(saved);
    }

    /**
     * Deletes an education entry.
     */
    @Transactional
    public void deleteEducation(UUID id) {
        if (!educationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Education", "id", id);
        }
        educationRepository.deleteById(id);
        log.info("Deleted education: {}", id);
    }

    /**
     * Toggles the publish status of an education entry.
     */
    @Transactional
    public EducationResponse setPublished(UUID id, boolean published) {
        Education education = educationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", id));

        education.setPublished(published);
        Education saved = educationRepository.save(education);

        log.info("Set education {} published={}", id, published);
        return mapper.toEducationResponse(saved);
    }

    /**
     * Reorders education entries.
     * Validates all IDs exist before updating.
     */
    @Transactional
    public List<EducationResponse> reorderEducation(ReorderRequest request) {
        List<UUID> orderedIds = request.getOrderedIds();
        
        // Validate all IDs exist
        List<Education> educations = educationRepository.findAllById(orderedIds);
        if (educations.size() != orderedIds.size()) {
            List<UUID> foundIds = educations.stream().map(Education::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid education IDs: " + missingIds,
                    "orderedIds"
            );
        }
        
        // Update sort orders in a single transaction
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID targetId = orderedIds.get(i);
            int newSortOrder = i;
            educations.stream()
                    .filter(edu -> edu.getId().equals(targetId))
                    .findFirst()
                    .ifPresent(edu -> edu.setSortOrder(newSortOrder));
        }
        educationRepository.saveAll(educations);
        
        log.info("Reordered {} education entries", orderedIds.size());
        return getAllEducation();
    }

}
