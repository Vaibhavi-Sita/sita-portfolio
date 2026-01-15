package com.sita.portfolio.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * Entity representing an education entry.
 */
@Entity
@Table(name = "education", schema = "portfolio")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Education extends PublishableEntity {

    @Column(name = "institution", nullable = false, length = 200)
    private String institution;

    @Column(name = "degree", nullable = false, length = 200)
    private String degree;

    @Column(name = "field_of_study", length = 200)
    private String fieldOfStudy;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "start_year", nullable = false)
    private int startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(name = "gpa", length = 20)
    private String gpa;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

}
