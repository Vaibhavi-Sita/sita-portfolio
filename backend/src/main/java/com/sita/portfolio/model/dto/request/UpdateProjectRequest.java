package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

/**
 * Request DTO for updating an existing project.
 * All fields are optional - only provided fields will be updated.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectRequest {

    @Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters")
    private String title;

    @Size(max = 150, message = "Slug must not exceed 150 characters")
    private String slug;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 5000, message = "Long description must not exceed 5000 characters")
    private String longDescription;

    @Size(max = 500, message = "Tech stack must not exceed 500 characters")
    private String techStack;

    @URL(message = "Live URL must be a valid URL")
    @Size(max = 500, message = "Live URL must not exceed 500 characters")
    private String liveUrl;

    @URL(message = "GitHub URL must be a valid URL")
    @Size(max = 500, message = "GitHub URL must not exceed 500 characters")
    private String githubUrl;

    @URL(message = "Image URL must be a valid URL")
    @Size(max = 500, message = "Image URL must not exceed 500 characters")
    private String imageUrl;

    private Boolean featured;

    private Boolean published;

    private Integer sortOrder;

}
