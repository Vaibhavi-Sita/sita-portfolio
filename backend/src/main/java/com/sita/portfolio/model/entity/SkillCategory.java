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

import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a skill category (e.g., Languages, Frameworks).
 */
@Entity
@Table(name = "skill_category", schema = "portfolio")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCategory extends PublishableEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "icon", length = 50)
    private String icon;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<SkillItem> skills = new ArrayList<>();

    public void addSkill(SkillItem skill) {
        skills.add(skill);
        skill.setCategory(this);
    }

    public void removeSkill(SkillItem skill) {
        skills.remove(skill);
        skill.setCategory(null);
    }

}
