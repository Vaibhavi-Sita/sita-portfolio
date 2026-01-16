package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactMessageRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be at most 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 150, message = "Email must be at most 150 characters")
    private String email;

    @Size(max = 150, message = "Subject must be at most 150 characters")
    private String subject;

    @NotBlank(message = "Message is required")
    @Size(max = 4000, message = "Message must be at most 4000 characters")
    private String message;

    /**
     * Honeypot field for spam bots. Must stay empty.
     */
    @Size(max = 200)
    private String honeypot;

    /**
     * CAPTCHA token (e.g., reCAPTCHA v2/v3).
     */
    @NotBlank(message = "Captcha verification is required")
    private String captchaToken;
}
