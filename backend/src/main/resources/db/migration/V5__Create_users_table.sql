CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Insert default user for existing instruments
-- Password: "admin123" (hashed with BCrypt)
INSERT INTO users (id, username, password, nickname) 
VALUES (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin')
ON CONFLICT (username) DO NOTHING;

-- Ensure the sequence is set correctly
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

