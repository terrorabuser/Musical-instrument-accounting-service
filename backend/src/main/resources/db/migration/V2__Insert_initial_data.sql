INSERT INTO musical_instruments (name, type, brand, model, purchase_price, current_value, purchase_date, condition_status, description, serial_number)
VALUES
    ('Fender Stratocaster', 'Гитара', 'Fender', 'Stratocaster Standard', 45000.00, 42000.00, '2022-03-15', 'Отличное', 'Классическая электрогитара, цвет sunburst', 'FND-STR-2022-001'),
    ('Yamaha C3', 'Фортепиано', 'Yamaha', 'C3 Grand Piano', 850000.00, 800000.00, '2021-06-20', 'Отличное', 'Концертный рояль, черный глянец', 'YMH-C3-2021-045'),
    ('Gibson Les Paul', 'Гитара', 'Gibson', 'Les Paul Standard', 65000.00, 60000.00, '2023-01-10', 'Хорошее', 'Электрогитара, цвет cherry sunburst', 'GBN-LP-2023-012'),
    ('Yamaha YAS-280', 'Саксофон', 'Yamaha', 'YAS-280', 125000.00, 115000.00, '2022-09-05', 'Отличное', 'Альтовый саксофон для начинающих', 'YMH-YAS-2022-078'),
    ('Pearl Export', 'Ударные', 'Pearl', 'Export EXX725', 55000.00, 50000.00, '2022-11-12', 'Хорошее', 'Барабанная установка 5 частей', 'PRL-EXP-2022-033'),
    ('Fender Precision Bass', 'Бас-гитара', 'Fender', 'Precision Bass', 52000.00, 48000.00, '2023-02-28', 'Отличное', 'Четырехструнная бас-гитара, цвет black', 'FND-PB-2023-005'),
    ('Steinway Model M', 'Фортепиано', 'Steinway & Sons', 'Model M', 3200000.00, 3000000.00, '2020-05-18', 'Отличное', 'Рояль для дома, эбеновое дерево', 'STW-M-2020-089'),
    ('Martin D-28', 'Гитара', 'Martin', 'D-28', 180000.00, 170000.00, '2021-08-22', 'Отличное', 'Акустическая гитара, массив ели и палисандра', 'MRT-D28-2021-156'),
    ('Selmer Mark VI', 'Саксофон', 'Selmer', 'Mark VI', 450000.00, 420000.00, '2019-12-10', 'Хорошее', 'Легендарный альтовый саксофон, винтаж', 'SLM-MK6-2019-234'),
    ('Ludwig Classic Maple', 'Ударные', 'Ludwig', 'Classic Maple', 180000.00, 165000.00, '2022-07-30', 'Отличное', 'Профессиональная барабанная установка', 'LDW-CM-2022-067')
ON CONFLICT (serial_number) DO NOTHING;


