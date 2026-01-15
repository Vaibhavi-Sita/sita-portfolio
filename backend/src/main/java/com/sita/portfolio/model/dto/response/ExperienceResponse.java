package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Response DTO for experience data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceResponse {

    private UUID id;
    private String company;
    private String role;
    private String location;
    private String employmentType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private String techStack;
    private String companyUrl;
    private String logoUrl;
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
