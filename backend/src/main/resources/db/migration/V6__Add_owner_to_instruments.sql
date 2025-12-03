-- Add owner_id column as nullable first
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'musical_instruments' AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE musical_instruments ADD COLUMN owner_id BIGINT;
    END IF;
END $$;

-- Update existing instruments to have default owner (admin user with id=1)
-- This assumes V5 has already created the admin user
UPDATE musical_instruments 
SET owner_id = 1 
WHERE owner_id IS NULL;

-- Now make it NOT NULL
ALTER TABLE musical_instruments 
ALTER COLUMN owner_id SET NOT NULL;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_instruments_owner'
    ) THEN
        ALTER TABLE musical_instruments 
        ADD CONSTRAINT fk_instruments_owner 
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_musical_instruments_owner_id ON musical_instruments(owner_id);

