package com.sita.portfolio.service;

import com.sita.portfolio.exception.BadRequestException;
import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.*;
import com.sita.portfolio.model.dto.response.CertificationResponse;
import com.sita.portfolio.model.entity.Certification;
import com.sita.portfolio.repository.CertificationRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service for certification management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final EntityMapper mapper;

    /**
     * Gets all certifications (admin view - includes unpublished).
     */
    @Transactional(readOnly = true)
    public List<CertificationResponse> getAllCertifications() {
        return mapper.toCertificationResponseList(
                certificationRepository.findAllByOrderBySortOrderAsc()
        );
    }

    /**
     * Gets a certification by ID.
     */
    @Transactional(readOnly = true)
    public CertificationResponse getCertification(UUID id) {
        return certificationRepository.findById(id)
                .map(mapper::toCertificationResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));
    }

    /**
     * Creates a new certification.
     */
    @Transactional
    public CertificationResponse createCertification(CreateCertificationRequest request) {
        int maxSortOrder = certificationRepository.findMaxSortOrder();

        Certification certification = Certification.builder()
                .name(request.getName())
                .issuer(request.getIssuer())
                .issueDate(request.getIssueDate())
                .expiryDate(request.getExpiryDate())
                .credentialId(request.getCredentialId())
                .credentialUrl(request.getCredentialUrl())
                .badgeUrl(request.getBadgeUrl())
                .published(request.isPublished())
                .sortOrder(maxSortOrder + 1)
                .build();

        Certification saved = certificationRepository.save(certification);
        log.info("Created certification: {}", saved.getName());

        return mapper.toCertificationResponse(saved);
    }

    /**
     * Updates an existing certification.
     */
    @Transactional
    public CertificationResponse updateCertification(UUID id, UpdateCertificationRequest request) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        if (request.getName() != null) certification.setName(request.getName());
        if (request.getIssuer() != null) certification.setIssuer(request.getIssuer());
        if (request.getIssueDate() != null) certification.setIssueDate(request.getIssueDate());
        if (request.getExpiryDate() != null) certification.setExpiryDate(request.getExpiryDate());
        if (request.getCredentialId() != null) certification.setCredentialId(request.getCredentialId());
        if (request.getCredentialUrl() != null) certification.setCredentialUrl(request.getCredentialUrl());
        if (request.getBadgeUrl() != null) certification.setBadgeUrl(request.getBadgeUrl());
        if (request.getPublished() != null) certification.setPublished(request.getPublished());
        if (request.getSortOrder() != null) certification.setSortOrder(request.getSortOrder());

        Certification saved = certificationRepository.save(certification);
        log.info("Updated certification: {}", id);

        return mapper.toCertificationResponse(saved);
    }

    /**
     * Deletes a certification.
     */
    @Transactional
    public void deleteCertification(UUID id) {
        if (!certificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Certification", "id", id);
        }
        certificationRepository.deleteById(id);
        log.info("Deleted certification: {}", id);
    }

    /**
     * Toggles the publish status of a certification.
     */
    @Transactional
    public CertificationResponse setPublished(UUID id, boolean published) {
        Certification certification = certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", id));

        certification.setPublished(published);
        Certification saved = certificationRepository.save(certification);

        log.info("Set certification {} published={}", id, published);
        return mapper.toCertificationResponse(saved);
    }

    /**
     * Reorders certifications.
     * Validates all IDs exist before updating.
     */
    @Transactional
    public List<CertificationResponse> reorderCertifications(ReorderRequest request) {
        List<UUID> orderedIds = request.getOrderedIds();
        
        // Validate all IDs exist
        List<Certification> certifications = certificationRepository.findAllById(orderedIds);
        if (certifications.size() != orderedIds.size()) {
            List<UUID> foundIds = certifications.stream().map(Certification::getId).toList();
            List<UUID> missingIds = orderedIds.stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new BadRequestException(
                    "Invalid certification IDs: " + missingIds,
                    "orderedIds"
            );
        }
        
        // Update sort orders in a single transaction
        for (int i = 0; i < orderedIds.size(); i++) {
            UUID targetId = orderedIds.get(i);
            int newSortOrder = i;
            certifications.stream()
                    .filter(cert -> cert.getId().equals(targetId))
                    .findFirst()
                    .ifPresent(cert -> cert.setSortOrder(newSortOrder));
        }
        certificationRepository.saveAll(certifications);
        
        log.info("Reordered {} certifications", orderedIds.size());
        return getAllCertifications();
    }

}
