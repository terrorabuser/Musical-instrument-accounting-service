CREATE TABLE IF NOT EXISTS musical_instruments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    purchase_price NUMERIC(10, 2) NOT NULL,
    current_value NUMERIC(10, 2) NOT NULL,
    purchase_date DATE NOT NULL,
    condition_status VARCHAR(50),
    description VARCHAR(1000),
    serial_number VARCHAR(255) UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_musical_instruments_type ON musical_instruments(type);
CREATE INDEX IF NOT EXISTS idx_musical_instruments_brand ON musical_instruments(brand);
CREATE INDEX IF NOT EXISTS idx_musical_instruments_serial_number ON musical_instruments(serial_number);


