package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for skill category data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCategoryResponse {

    private UUID id;
    private String name;
    private String icon;
    private boolean published;
    private int sortOrder;
    private List<SkillItemResponse> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillItemResponse {
        private UUID id;
        private String name;
        private String iconUrl;
        private String proficiency;
        private int sortOrder;
    }

}
