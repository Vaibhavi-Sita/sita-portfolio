package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating contact settings.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateContactSettingsRequest {

    @Email(message = "Email must be a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Size(max = 50, message = "Phone must not exceed 50 characters")
    private String phone;

    @Size(max = 200, message = "Location must not exceed 200 characters")
    private String location;

    @Size(max = 100, message = "Availability status must not exceed 100 characters")
    private String availabilityStatus;

    private Boolean formEnabled;

    @Email(message = "Form recipient must be a valid email address")
    @Size(max = 255, message = "Form recipient must not exceed 255 characters")
    private String formRecipient;

    @Size(max = 500, message = "Success message must not exceed 500 characters")
    private String successMessage;

}
