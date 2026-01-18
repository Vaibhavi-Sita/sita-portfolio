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
 * Request DTO for reordering skill items within a category.
 * Accepts an ordered list of item IDs to infer sort order.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderSkillItemsRequest {

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotNull(message = "Ordered IDs list is required")
    @NotEmpty(message = "Ordered IDs list cannot be empty")
    private List<UUID> orderedIds;

}
