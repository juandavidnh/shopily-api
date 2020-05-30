BEGIN;

TRUNCATE 
    shopily_supermarkets,
    shopily_users,
    shopily_item_list,
    shopily_shopping_list
    RESTART IDENTITY CASCADE;

INSERT INTO shopily_supermarkets (supermarket_name, supermarket_city)
VALUES
    ('Megamaxi (6 de Diciembre)', 'Quito');

INSERT INTO shopily_users (email, password, first_name, last_name, city, supermarket_id)
VALUES
    ('jd@choretastic.com', '$2a$12$Gyv4dTZ5Gm3W7sSmGqjRC.dT681fbCnv3HvrtuX8eYQast4iSOL16', 'Juan', 'Nunez', 'Quito', 1),
    ('mashua@choretastic.com', '$2a$12$jmdRvAV4MaPd7I15E1A4G.aaMlFcXdZ9DRpEy5/ZvQmrJdfIAFIGC', 'Mashua', 'Ninini', 'Quito', 1),
    ('paco@choretastic.com', '$2a$12$9BQ6lP.A1SjKt7SDUMbTU.19jkaRTn71TsCWYzrVfYN6olb7iVFa.', 'Paco', 'Coco', 'Quito', 1);

INSERT INTO shopily_item_list (code, product_name, aisle, supermarket_id)
VALUES 
    ('MEGA0001', 'Sausages', 2, 1),
    ('MEGA0002', 'Fruit Loops', 10, 1),
    ('MEGA0003', 'Whiskas', 5, 1),
    ('MEGA0004', 'Oranges', 4, 1),
    ('MEGA0005', 'Apples', 4, 1),
    ('MEGA0006', 'Ham', 2, 1),
    ('MEGA0007', 'Shampoo', 6, 1),
    ('MEGA0008', 'Flour', 7, 1),
    ('MEGA0009', 'Beer', 8, 1),
    ('MEGA0010', 'Ice Cream', 1, 1),
    ('MEGA0011', 'Ground Beef', 9, 1),
    ('MEGA0012', 'Chicken Drums', 9, 1),
    ('MEGA0013', 'Frozen Chicken Fingers', 1, 1),
    ('MEGA0014', 'Red Wine', 8, 1);

INSERT INTO shopily_shopping_list (user_id, item_id)
VALUES
    (1, 9),
    (1, 10),
    (1, 11),
    (1, 12),
    (2, 1),
    (2, 3),
    (2, 9),
    (2, 4);

COMMIT;