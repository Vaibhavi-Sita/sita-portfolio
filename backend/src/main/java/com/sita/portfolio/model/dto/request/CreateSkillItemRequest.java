package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.util.UUID;

/**
 * Request DTO for creating a new skill item.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSkillItemRequest {

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    @URL(message = "Icon URL must be a valid URL")
    @Size(max = 500, message = "Icon URL must not exceed 500 characters")
    private String iconUrl;

    @Size(max = 50, message = "Proficiency must not exceed 50 characters")
    private String proficiency;

}
