package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

/**
 * Request DTO for updating the profile.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters")
    private String title;

    @Size(max = 300, message = "Tagline must not exceed 300 characters")
    private String tagline;

    @Size(max = 5000, message = "Bio must not exceed 5000 characters")
    private String bio;

    @URL(message = "Avatar URL must be a valid URL")
    @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
    private String avatarUrl;

    @URL(message = "Resume URL must be a valid URL")
    @Size(max = 500, message = "Resume URL must not exceed 500 characters")
    private String resumeUrl;

    @Email(message = "Email must be a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @URL(message = "GitHub URL must be a valid URL")
    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    private String githubUrl;

    @URL(message = "LinkedIn URL must be a valid URL")
    @Size(max = 500, message = "LinkedIn URL must not exceed 500 characters")
    private String linkedinUrl;

    @URL(message = "Twitter URL must be a valid URL")
    @Size(max = 500, message = "Twitter URL must not exceed 500 characters")
    private String twitterUrl;

    @Size(max = 100, message = "Nickname must not exceed 100 characters")
    private String nickname;
}
