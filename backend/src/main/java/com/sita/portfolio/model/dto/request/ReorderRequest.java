package com.sita.portfolio.model.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request DTO for reordering items (drag-and-drop support).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderRequest {

    @NotNull(message = "Ordered IDs list is required")
    @NotEmpty(message = "Ordered IDs list cannot be empty")
    private List<UUID> orderedIds;

}
