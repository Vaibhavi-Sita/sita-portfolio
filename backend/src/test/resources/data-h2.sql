-- Test data seed for H2 database (only used when Docker is not available)
-- Admin user seed (password: ChangeMe123!)
-- BCrypt hash generated with rounds=12
INSERT INTO portfolio.admin_user (id, email, password_hash, display_name, is_active, created_at, updated_at)
SELECT RANDOM_UUID(), 'admin@portfolio.local', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYWV8hFQOJy.', 'Admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM portfolio.admin_user WHERE email = 'admin@portfolio.local');
