package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating an existing skill category.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSkillCategoryRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(max = 50, message = "Icon must not exceed 50 characters")
    private String icon;

    private Boolean published;

    private Integer sortOrder;

}
