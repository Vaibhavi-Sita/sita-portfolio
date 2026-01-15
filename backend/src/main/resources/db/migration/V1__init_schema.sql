-- =============================================================================
-- V1__init_schema.sql
-- Portfolio Database Schema
-- =============================================================================

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS portfolio;

-- Enable UUID extension (Supabase has this enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROFILE (Single Row)
-- =============================================================================

CREATE TABLE portfolio.profile (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    title           VARCHAR(150) NOT NULL,
    tagline         VARCHAR(300),
    bio             TEXT,
    avatar_url      VARCHAR(500),
    resume_url      VARCHAR(500),
    email           VARCHAR(255),
    github_url      VARCHAR(500),
    linkedin_url    VARCHAR(500),
    twitter_url     VARCHAR(500),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Ensure only one profile row can exist
CREATE UNIQUE INDEX idx_profile_singleton ON portfolio.profile ((TRUE));

-- =============================================================================
-- EXPERIENCE
-- =============================================================================

CREATE TABLE portfolio.experience (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company         VARCHAR(150) NOT NULL,
    role            VARCHAR(150) NOT NULL,
    location        VARCHAR(150),
    employment_type VARCHAR(50),  -- full-time, contract, freelance, etc.
    start_date      DATE NOT NULL,
    end_date        DATE,         -- NULL means current position
    description     TEXT,
    tech_stack      VARCHAR(500), -- Comma-separated technologies
    company_url     VARCHAR(500),
    logo_url        VARCHAR(500),
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experience_published_order ON portfolio.experience (is_published, sort_order);

-- =============================================================================
-- EXPERIENCE BULLETS
-- =============================================================================

CREATE TABLE portfolio.experience_bullet (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experience_id   UUID NOT NULL REFERENCES portfolio.experience(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_experience_bullet_fk ON portfolio.experience_bullet (experience_id);
CREATE INDEX idx_experience_bullet_order ON portfolio.experience_bullet (experience_id, sort_order);

-- =============================================================================
-- PROJECT
-- =============================================================================

CREATE TABLE portfolio.project (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(150) NOT NULL,
    slug            VARCHAR(150) UNIQUE,
    description     TEXT,
    long_description TEXT,
    tech_stack      VARCHAR(500), -- Comma-separated technologies
    live_url        VARCHAR(500),
    github_url      VARCHAR(500),
    image_url       VARCHAR(500),
    thumbnail_url   VARCHAR(500),
    is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_published_order ON portfolio.project (is_published, sort_order);
CREATE INDEX idx_project_featured ON portfolio.project (is_featured, is_published);
CREATE INDEX idx_project_slug ON portfolio.project (slug) WHERE slug IS NOT NULL;

-- =============================================================================
-- PROJECT BULLETS
-- =============================================================================

CREATE TABLE portfolio.project_bullet (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID NOT NULL REFERENCES portfolio.project(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_project_bullet_fk ON portfolio.project_bullet (project_id);
CREATE INDEX idx_project_bullet_order ON portfolio.project_bullet (project_id, sort_order);

-- =============================================================================
-- SKILL CATEGORY
-- =============================================================================

CREATE TABLE portfolio.skill_category (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    icon            VARCHAR(50),  -- Icon identifier (e.g., 'code', 'database')
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_category_published_order ON portfolio.skill_category (is_published, sort_order);

-- =============================================================================
-- SKILL ITEM
-- =============================================================================

CREATE TABLE portfolio.skill_item (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID NOT NULL REFERENCES portfolio.skill_category(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    icon_url        VARCHAR(500),
    proficiency     VARCHAR(50),  -- Optional: beginner, intermediate, advanced, expert
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skill_item_fk ON portfolio.skill_item (category_id);
CREATE INDEX idx_skill_item_order ON portfolio.skill_item (category_id, sort_order);

-- =============================================================================
-- EDUCATION
-- =============================================================================

CREATE TABLE portfolio.education (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution     VARCHAR(200) NOT NULL,
    degree          VARCHAR(200) NOT NULL,
    field_of_study  VARCHAR(200),
    location        VARCHAR(150),
    start_year      INT NOT NULL,
    end_year        INT,          -- NULL means currently enrolled
    gpa             VARCHAR(20),
    description     TEXT,
    logo_url        VARCHAR(500),
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_education_published_order ON portfolio.education (is_published, sort_order);

-- =============================================================================
-- CERTIFICATION
-- =============================================================================

CREATE TABLE portfolio.certification (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    issuer          VARCHAR(200) NOT NULL,
    issue_date      DATE NOT NULL,
    expiry_date     DATE,         -- NULL means no expiry
    credential_id   VARCHAR(200),
    credential_url  VARCHAR(500),
    badge_url       VARCHAR(500),
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certification_published_order ON portfolio.certification (is_published, sort_order);

-- =============================================================================
-- CONTACT SETTINGS (Single Row)
-- =============================================================================

CREATE TABLE portfolio.contact_settings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) NOT NULL,
    phone               VARCHAR(50),
    location            VARCHAR(200),
    availability_status VARCHAR(100),  -- e.g., "Open to opportunities"
    form_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
    form_recipient      VARCHAR(255),  -- Email to receive form submissions
    success_message     TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Ensure only one contact settings row can exist
CREATE UNIQUE INDEX idx_contact_settings_singleton ON portfolio.contact_settings ((TRUE));

-- =============================================================================
-- ADMIN USER
-- =============================================================================

CREATE TABLE portfolio.admin_user (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_admin_user_email ON portfolio.admin_user (email);

-- =============================================================================
-- TRIGGER FUNCTION: Auto-update updated_at timestamp
-- =============================================================================

CREATE OR REPLACE FUNCTION portfolio.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- APPLY TRIGGERS TO TABLES WITH updated_at
-- =============================================================================

CREATE TRIGGER trg_profile_updated_at
    BEFORE UPDATE ON portfolio.profile
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_experience_updated_at
    BEFORE UPDATE ON portfolio.experience
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_project_updated_at
    BEFORE UPDATE ON portfolio.project
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_skill_category_updated_at
    BEFORE UPDATE ON portfolio.skill_category
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_education_updated_at
    BEFORE UPDATE ON portfolio.education
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_certification_updated_at
    BEFORE UPDATE ON portfolio.certification
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_contact_settings_updated_at
    BEFORE UPDATE ON portfolio.contact_settings
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

CREATE TRIGGER trg_admin_user_updated_at
    BEFORE UPDATE ON portfolio.admin_user
    FOR EACH ROW EXECUTE FUNCTION portfolio.update_updated_at_column();

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON SCHEMA portfolio IS 'Portfolio application schema';

COMMENT ON TABLE portfolio.profile IS 'Single-row table containing portfolio owner profile information';
COMMENT ON TABLE portfolio.experience IS 'Work experience entries';
COMMENT ON TABLE portfolio.experience_bullet IS 'Bullet points for experience entries';
COMMENT ON TABLE portfolio.project IS 'Portfolio project entries';
COMMENT ON TABLE portfolio.project_bullet IS 'Bullet points/features for project entries';
COMMENT ON TABLE portfolio.skill_category IS 'Skill categories (e.g., Languages, Frameworks)';
COMMENT ON TABLE portfolio.skill_item IS 'Individual skills within categories';
COMMENT ON TABLE portfolio.education IS 'Educational background entries';
COMMENT ON TABLE portfolio.certification IS 'Professional certifications';
COMMENT ON TABLE portfolio.contact_settings IS 'Single-row table for contact page configuration';
COMMENT ON TABLE portfolio.admin_user IS 'Admin users for dashboard access';

COMMENT ON COLUMN portfolio.experience.sort_order IS 'Lower values appear first; used for drag-and-drop reordering';
COMMENT ON COLUMN portfolio.experience.is_published IS 'When false, hidden from public portfolio';
COMMENT ON COLUMN portfolio.project.is_featured IS 'Featured projects appear prominently on homepage';
