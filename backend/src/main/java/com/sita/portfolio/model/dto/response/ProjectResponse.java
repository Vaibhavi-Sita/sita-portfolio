package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Response DTO for project data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private UUID id;
    private String title;
    private String slug;
    private String description;
    private String longDescription;
    private String techStack;
    private String liveUrl;
    private String githubUrl;
    private String imageUrl;
    private String thumbnailUrl;
    private boolean featured;
    private boolean published;
    private int sortOrder;
    private List<BulletResponse> bullets;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BulletResponse {
        private UUID id;
        private String content;
        private int sortOrder;
    }

}
