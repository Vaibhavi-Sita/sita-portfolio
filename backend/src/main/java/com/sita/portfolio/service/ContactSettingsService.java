package com.sita.portfolio.service;

import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.UpdateContactSettingsRequest;
import com.sita.portfolio.model.dto.response.ContactSettingsResponse;
import com.sita.portfolio.model.entity.ContactSettings;
import com.sita.portfolio.repository.ContactSettingsRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for contact settings management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ContactSettingsService {

    private final ContactSettingsRepository contactSettingsRepository;
    private final EntityMapper mapper;

    /**
     * Gets the contact settings.
     */
    @Transactional(readOnly = true)
    public ContactSettingsResponse getContactSettings() {
        return contactSettingsRepository.findSettings()
                .map(mapper::toContactSettingsResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Contact settings not found"));
    }

    /**
     * Updates the contact settings.
     */
    @Transactional
    public ContactSettingsResponse updateContactSettings(UpdateContactSettingsRequest request) {
        ContactSettings settings = contactSettingsRepository.findSettings()
                .orElseThrow(() -> new ResourceNotFoundException("Contact settings not found"));

        if (request.getEmail() != null) settings.setEmail(request.getEmail());
        if (request.getPhone() != null) settings.setPhone(request.getPhone());
        if (request.getLocation() != null) settings.setLocation(request.getLocation());
        if (request.getAvailabilityStatus() != null) settings.setAvailabilityStatus(request.getAvailabilityStatus());
        if (request.getFormEnabled() != null) settings.setFormEnabled(request.getFormEnabled());
        if (request.getFormRecipient() != null) settings.setFormRecipient(request.getFormRecipient());
        if (request.getSuccessMessage() != null) settings.setSuccessMessage(request.getSuccessMessage());

        ContactSettings saved = contactSettingsRepository.save(settings);
        log.info("Updated contact settings");

        return mapper.toContactSettingsResponse(saved);
    }

}
