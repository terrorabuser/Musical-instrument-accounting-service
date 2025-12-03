ALTER TABLE musical_instruments
DROP COLUMN IF EXISTS image_data,
DROP COLUMN IF EXISTS image_content_type;

ALTER TABLE musical_instruments
ADD COLUMN image_data BYTEA,
ADD COLUMN image_content_type VARCHAR(100);


