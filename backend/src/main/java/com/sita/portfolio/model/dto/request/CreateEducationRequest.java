package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

/**
 * Request DTO for creating a new education entry.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEducationRequest {

    @NotBlank(message = "Institution is required")
    @Size(min = 2, max = 200, message = "Institution must be between 2 and 200 characters")
    private String institution;

    @NotBlank(message = "Degree is required")
    @Size(min = 2, max = 200, message = "Degree must be between 2 and 200 characters")
    private String degree;

    @Size(max = 200, message = "Field of study must not exceed 200 characters")
    private String fieldOfStudy;

    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String location;

    @NotNull(message = "Start year is required")
    @Min(value = 1900, message = "Start year must be after 1900")
    @Max(value = 2100, message = "Start year must be before 2100")
    private Integer startYear;

    @Min(value = 1900, message = "End year must be after 1900")
    @Max(value = 2100, message = "End year must be before 2100")
    private Integer endYear;

    @Size(max = 20, message = "GPA must not exceed 20 characters")
    private String gpa;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @URL(message = "Logo URL must be a valid URL")
    @Size(max = 500, message = "Logo URL must not exceed 500 characters")
    private String logoUrl;

    private boolean published;

}
