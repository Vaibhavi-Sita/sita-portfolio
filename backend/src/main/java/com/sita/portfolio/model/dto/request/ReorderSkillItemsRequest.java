package com.sita.portfolio.model.dto.request;

import jakarta.validation.Valid;
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
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReorderSkillItemsRequest {

    @NotNull(message = "Category ID is required")
    private UUID categoryId;

    @NotNull(message = "Items list is required")
    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    private List<ItemOrder> items;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemOrder {
        
        @NotNull(message = "Item ID is required")
        private UUID id;
        
        @NotNull(message = "Sort order is required")
        private Integer sortOrder;
    }

}
