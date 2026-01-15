package com.sita.portfolio.service;

import com.sita.portfolio.exception.ResourceNotFoundException;
import com.sita.portfolio.model.dto.request.UpdateProfileRequest;
import com.sita.portfolio.model.dto.response.ProfileResponse;
import com.sita.portfolio.model.entity.Profile;
import com.sita.portfolio.repository.ProfileRepository;
import com.sita.portfolio.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for profile management (admin operations).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final EntityMapper mapper;

    /**
     * Gets the profile.
     */
    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        return profileRepository.findProfile()
                .map(mapper::toProfileResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));
    }

    /**
     * Updates the profile.
     */
    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        Profile profile = profileRepository.findProfile()
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        if (request.getName() != null) profile.setName(request.getName());
        if (request.getTitle() != null) profile.setTitle(request.getTitle());
        if (request.getTagline() != null) profile.setTagline(request.getTagline());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getResumeUrl() != null) profile.setResumeUrl(request.getResumeUrl());
        if (request.getEmail() != null) profile.setEmail(request.getEmail());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getTwitterUrl() != null) profile.setTwitterUrl(request.getTwitterUrl());
        if (request.getNickname() != null) profile.setNickname(request.getNickname());
        Profile saved = profileRepository.save(profile);
        log.info("Updated profile: {}", saved.getName());

        return mapper.toProfileResponse(saved);
    }

}
