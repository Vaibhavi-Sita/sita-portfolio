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
 * Entity representing a portfolio project.
 */
@Entity
@Table(name = "project", schema = "portfolio")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends PublishableEntity {

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "slug", unique = true, length = 150)
    private String slug;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "long_description", columnDefinition = "TEXT")
    private String longDescription;

    @Column(name = "tech_stack", length = 500)
    private String techStack;

    @Column(name = "live_url", length = 500)
    private String liveUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private boolean featured = false;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ProjectBullet> bullets = new ArrayList<>();

    public void addBullet(ProjectBullet bullet) {
        bullets.add(bullet);
        bullet.setProject(this);
    }

    public void removeBullet(ProjectBullet bullet) {
        bullets.remove(bullet);
        bullet.setProject(null);
    }

}
