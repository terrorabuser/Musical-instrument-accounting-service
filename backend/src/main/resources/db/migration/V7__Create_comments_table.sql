CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    text VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    author_id BIGINT NOT NULL,
    instrument_id BIGINT NOT NULL,
    CONSTRAINT fk_comments_author 
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_instrument 
        FOREIGN KEY (instrument_id) REFERENCES musical_instruments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_comments_instrument_id ON comments(instrument_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);




