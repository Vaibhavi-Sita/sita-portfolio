package com.sita.portfolio.model.dto.response;

import lombok.Builder;
import lombok.Value;

import java.time.OffsetDateTime;
import java.util.UUID;

@Value
@Builder
public class ContactMessageResponse {
    UUID id;
    String name;
    String email;
    String subject;
    String message;
    String status;
    OffsetDateTime createdAt;
    String userAgent;
    String ipAddress;
}
