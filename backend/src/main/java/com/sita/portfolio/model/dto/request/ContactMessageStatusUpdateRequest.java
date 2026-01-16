package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContactMessageStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "new|read|archived", flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Status must be one of: new, read, archived")
    private String status;
}
