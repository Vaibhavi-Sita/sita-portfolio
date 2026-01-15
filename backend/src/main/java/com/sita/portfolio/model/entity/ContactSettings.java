package com.sita.portfolio.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Entity representing contact page settings.
 * This is a singleton table - only one row should exist.
 */
@Entity
@Table(name = "contact_settings", schema = "portfolio")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ContactSettings extends BaseEntity {

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "availability_status", length = 100)
    private String availabilityStatus;

    @Column(name = "form_enabled", nullable = false)
    @Builder.Default
    private boolean formEnabled = true;

    @Column(name = "form_recipient", length = 255)
    private String formRecipient;

    @Column(name = "success_message", columnDefinition = "TEXT")
    private String successMessage;

}
