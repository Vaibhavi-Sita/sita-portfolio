package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for contact settings.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactSettingsResponse {

    private UUID id;
    private String email;
    private String phone;
    private String location;
    private String availabilityStatus;
    private boolean formEnabled;
    private String formRecipient;
    private String successMessage;

}
