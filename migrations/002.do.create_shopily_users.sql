CREATE TABLE shopily_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    city TEXT,
    supermarket_id INTEGER 
        REFERENCES shopily_supermarkets(id) ON DELETE SET NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now()
);