package com.sita.portfolio.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Response DTO for education data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponse {

    private UUID id;
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String location;
    private int startYear;
    private Integer endYear;
    private String gpa;
    private String description;
    private String logoUrl;
    private boolean published;
    private int sortOrder;

}
