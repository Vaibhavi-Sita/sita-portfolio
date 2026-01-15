-- =============================================================================
-- V2__seed_minimal_data.sql
-- Minimal seed data for portfolio application
-- =============================================================================

-- =============================================================================
-- PROFILE (Placeholder)
-- =============================================================================

INSERT INTO portfolio.profile (
    name,
    title,
    tagline,
    bio,
    email
) VALUES (
    'Your Name',
    'Software Engineer',
    'I turn coffee into code and bugs into features.',
    'Welcome to my portfolio! This is a placeholder bio. Update this content through the admin dashboard.',
    'hello@example.com'
);

-- =============================================================================
-- CONTACT SETTINGS (Placeholder)
-- =============================================================================

INSERT INTO portfolio.contact_settings (
    email,
    availability_status,
    form_enabled,
    success_message
) VALUES (
    'hello@example.com',
    'Open to opportunities',
    TRUE,
    'Message received! I''ll get back to you faster than a CI pipeline.'
);

-- =============================================================================
-- SKILL CATEGORIES (Empty placeholders for structure)
-- =============================================================================

INSERT INTO portfolio.skill_category (name, icon, sort_order) VALUES
    ('Languages', 'code', 1),
    ('Frameworks', 'layers', 2),
    ('Databases', 'database', 3),
    ('Tools & DevOps', 'terminal', 4);

-- =============================================================================
-- NOTE: Experience, Projects, Education, Certifications
-- are intentionally left empty for admin to populate.
-- =============================================================================
