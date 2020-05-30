CREATE TABLE shopily_supermarkets (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    supermarket_name TEXT NOT NULL,
    supermarket_city TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);