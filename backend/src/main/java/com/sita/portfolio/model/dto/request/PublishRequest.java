package com.sita.portfolio.model.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for toggling publish status.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublishRequest {

    @NotNull(message = "isPublished is required")
    @JsonProperty("isPublished")
    private Boolean published;

}
