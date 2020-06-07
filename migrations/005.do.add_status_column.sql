CREATE TYPE STATUS AS ENUM('pending', 'complete');

ALTER TABLE shopily_shopping_list ADD status STATUS NOT NULL DEFAULT 'pending'; 