package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for import operation results.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImportResultResponse {

    private boolean success;
    private String message;
    private ImportCounts counts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportCounts {
        private int experiences;
        private int experienceBullets;
        private int projects;
        private int projectBullets;
        private int skillCategories;
        private int skillItems;
        private int education;
        private int certifications;
        private boolean profileUpdated;
        private boolean contactSettingsUpdated;
    }

    public static ImportResultResponse success(ImportCounts counts) {
        return ImportResultResponse.builder()
                .success(true)
                .message("Import completed successfully")
                .counts(counts)
                .build();
    }

}
