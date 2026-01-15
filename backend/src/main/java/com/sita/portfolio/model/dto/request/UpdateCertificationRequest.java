package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

/**
 * Request DTO for updating an existing certification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCertificationRequest {

    @Size(min = 2, max = 200, message = "Name must be between 2 and 200 characters")
    private String name;

    @Size(min = 2, max = 200, message = "Issuer must be between 2 and 200 characters")
    private String issuer;

    private LocalDate issueDate;

    private LocalDate expiryDate;

    @Size(max = 200, message = "Credential ID must not exceed 200 characters")
    private String credentialId;

    @URL(message = "Credential URL must be a valid URL")
    @Size(max = 500, message = "Credential URL must not exceed 500 characters")
    private String credentialUrl;

    @URL(message = "Badge URL must be a valid URL")
    @Size(max = 500, message = "Badge URL must not exceed 500 characters")
    private String badgeUrl;

    private Boolean published;

    private Integer sortOrder;

}
