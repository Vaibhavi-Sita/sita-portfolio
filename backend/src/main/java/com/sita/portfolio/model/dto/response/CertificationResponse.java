package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Response DTO for certification data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificationResponse {

    private UUID id;
    private String name;
    private String issuer;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String credentialId;
    private String credentialUrl;
    private String badgeUrl;
    private boolean published;
    private int sortOrder;

}
