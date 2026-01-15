package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

/**
 * Request DTO for updating an existing experience entry.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExperienceRequest {

    @Size(min = 2, max = 150, message = "Company name must be between 2 and 150 characters")
    private String company;

    @Size(min = 2, max = 150, message = "Role must be between 2 and 150 characters")
    private String role;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    @Size(max = 50, message = "Employment type must not exceed 50 characters")
    private String employmentType;

    private LocalDate startDate;

    private LocalDate endDate;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Size(max = 500, message = "Tech stack must not exceed 500 characters")
    private String techStack;

    @URL(message = "Company URL must be a valid URL")
    @Size(max = 500, message = "Company URL must not exceed 500 characters")
    private String companyUrl;

    @URL(message = "Logo URL must be a valid URL")
    @Size(max = 500, message = "Logo URL must not exceed 500 characters")
    private String logoUrl;

    private Boolean published;

    private Integer sortOrder;

}
