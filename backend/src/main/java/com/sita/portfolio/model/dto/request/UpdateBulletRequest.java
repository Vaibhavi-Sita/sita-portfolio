package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating a bullet point.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBulletRequest {

    @Size(min = 1, max = 1000, message = "Content must be between 1 and 1000 characters")
    private String content;

    private Integer sortOrder;

}
