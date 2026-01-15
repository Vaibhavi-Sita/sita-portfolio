package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for profile data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {

    private UUID id;
    private String name;
    private String title;
    private String tagline;
    private String bio;
    private String avatarUrl;
    private String resumeUrl;
    private String email;
    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;

}
