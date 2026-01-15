package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Aggregated response DTO containing all published portfolio data.
 * Used for the public portfolio endpoint to fetch everything in one request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioResponse {

    private ProfileResponse profile;
    private List<ExperienceResponse> experiences;
    private List<ProjectResponse> projects;
    private List<ProjectResponse> featuredProjects;
    private List<SkillCategoryResponse> skills;
    private List<EducationResponse> education;
    private List<CertificationResponse> certifications;
    private ContactSettingsResponse contact;

}
