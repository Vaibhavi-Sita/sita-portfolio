-- =============================================================================
-- V3__seed_admin.sql
-- Seed initial admin user
-- =============================================================================
-- IMPORTANT: Change this password immediately after first login!
-- Default credentials: admin@portfolio.local / ChangeMe123!
-- =============================================================================

INSERT INTO portfolio.admin_user (
    id,
    email,
    password_hash,
    display_name,
    is_active,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@portfolio.local',
    -- BCrypt hash of 'ChangeMe123!' with cost factor 12
    -- Generated using: BCrypt.hashpw("ChangeMe123!", BCrypt.gensalt(12))
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWV8hFQOJy.',
    'Admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;
