package com.sita.portfolio.model.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a work experience entry.
 */
@Entity
@Table(name = "experience", schema = "portfolio")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Experience extends PublishableEntity {

    @Column(name = "company", nullable = false, length = 150)
    private String company;

    @Column(name = "role", nullable = false, length = 150)
    private String role;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "employment_type", length = 50)
    private String employmentType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack", length = 500)
    private String techStack;

    @Column(name = "company_url", length = 500)
    private String companyUrl;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @OneToMany(mappedBy = "experience", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ExperienceBullet> bullets = new ArrayList<>();

    public void addBullet(ExperienceBullet bullet) {
        bullets.add(bullet);
        bullet.setExperience(this);
    }

    public void removeBullet(ExperienceBullet bullet) {
        bullets.remove(bullet);
        bullet.setExperience(null);
    }

}
