ALTER TABLE musical_instruments 
ADD COLUMN IF NOT EXISTS image_data BYTEA,
ADD COLUMN IF NOT EXISTS image_content_type VARCHAR(100);

